import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)

  const admin = serverSupabaseServiceRole(event)
  const day = new Date().toISOString().slice(0, 10)

  const [{ data: profile }, { data: usage }] = await Promise.all([
    admin.from('profiles').select('is_premium').eq('id', userId).maybeSingle(),
    admin.from('usage_days').select('count').eq('user_id', userId).eq('day', day).maybeSingle(),
  ])

  const limit = useRuntimeConfig(event).public.freeDailyLimit
  const used = usage?.count ?? 0
  const isPremium = profile?.is_premium ?? false

  return {
    used,
    limit: isPremium ? null : limit,
    remaining: isPremium ? null : Math.max(0, limit - used),
    isPremium,
  }
})
