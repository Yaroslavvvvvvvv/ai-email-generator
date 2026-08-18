import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

/**
 * Premium without a payment provider.
 *
 * There is no Stripe here and the assignment does not ask for one: the flow is
 * real (the flag is set server side, the limit genuinely disappears), only the
 * charge is imagined. Swapping in a checkout means calling this after the
 * webhook confirms payment instead of straight from the button.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorised' })
  }

  const { plan } = await readBody<{ plan?: string }>(event) ?? {}
  const isPremium = plan !== 'free'

  const admin = serverSupabaseServiceRole(event)
  const { error } = await admin
    .from('profiles')
    .update({ is_premium: isPremium })
    .eq('id', user.id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'upgrade_failed' })
  }

  return { isPremium }
})
