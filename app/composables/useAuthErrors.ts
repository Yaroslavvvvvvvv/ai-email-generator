/**
 * Supabase speaks English error strings; the user does not necessarily.
 * Everything unrecognised falls back to one honest sentence rather than a
 * raw message from a library.
 */
export function useAuthErrors() {
  const { t } = useI18n()

  return function describe(error: unknown): string {
    const raw = (error as { message?: string })?.message?.toLowerCase() ?? ''

    if (raw.includes('invalid login')) return t('auth.errors.invalid')
    if (raw.includes('already registered') || raw.includes('already exists')) return t('auth.errors.exists')
    if (raw.includes('password')) return t('auth.errors.weak')
    if (raw.includes('fetch') || raw.includes('network')) return t('errors.network')

    return t('auth.errors.generic')
  }
}
