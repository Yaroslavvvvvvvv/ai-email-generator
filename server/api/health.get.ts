/**
 * Deployment sanity check. Reports whether the pieces are wired, never what
 * they contain — a missing environment variable on a host looks exactly like
 * a code bug from the outside, and this tells the two apart in one request.
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig()

  return {
    ok: true,
    supabaseUrl: Boolean(config.public.supabase?.url),
    supabaseKey: Boolean(config.public.supabase?.key),
    serverKey: Boolean(config.supabase?.secretKey || config.supabase?.serviceKey),
    freeDailyLimit: config.public.freeDailyLimit,
  }
})
