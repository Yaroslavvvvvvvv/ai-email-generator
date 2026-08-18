import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { isEmailLocale, isLength, isTone } from '#shared/types/email'
import type { GenerationRequest } from '#shared/types/email'
import { createEmailProvider } from '~~/server/lib/email'

const TOPIC_MIN = 3
const TOPIC_MAX = 500

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorised' })
  }

  const body = await readBody<Partial<GenerationRequest>>(event)
  const topic = typeof body?.topic === 'string' ? body.topic.trim() : ''

  if (topic.length < TOPIC_MIN || topic.length > TOPIC_MAX) {
    throw createError({ statusCode: 422, statusMessage: 'invalid_topic' })
  }
  if (!isTone(body?.tone) || !isLength(body?.length) || !isEmailLocale(body?.locale)) {
    throw createError({ statusCode: 422, statusMessage: 'invalid_options' })
  }

  const limit = useRuntimeConfig(event).public.freeDailyLimit
  const admin = serverSupabaseServiceRole(event)

  // Check and spend in one statement — two tabs pressing Generate together
  // must not both slip past the last remaining generation.
  const { data: usage, error: usageError } = await admin
    .rpc('consume_generation', { p_user: user.id, p_limit: limit })
    .single<{ allowed: boolean, used: number, day_limit: number | null }>()

  if (usageError) {
    throw createError({ statusCode: 500, statusMessage: 'usage_unavailable' })
  }
  if (!usage.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'limit_reached',
      data: { used: usage.used, limit },
    })
  }

  const provider = createEmailProvider()
  const email = await provider.generate({
    topic,
    tone: body.tone,
    length: body.length,
    locale: body.locale,
  })

  const { data: saved, error: saveError } = await admin
    .from('generations')
    .insert({
      user_id: user.id,
      topic,
      tone: body.tone,
      length: body.length,
      locale: body.locale,
      subject: email.subject,
      body: email.body,
      provider: provider.id,
    })
    .select('id, created_at')
    .single()

  if (saveError) {
    throw createError({ statusCode: 500, statusMessage: 'save_failed' })
  }

  return {
    id: saved.id,
    createdAt: saved.created_at,
    ...email,
    used: usage.used,
    limit: usage.day_limit,
  }
})
