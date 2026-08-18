/**
 * Shared vocabulary for email generation.
 * Used by the dashboard form, the API route and every provider.
 */

export const TONES = ['formal', 'friendly', 'persuasive', 'direct'] as const
export const LENGTHS = ['short', 'medium', 'long'] as const
export const EMAIL_LOCALES = ['en', 'uk', 'ru'] as const

export type Tone = typeof TONES[number]
export type Length = typeof LENGTHS[number]
export type EmailLocale = typeof EMAIL_LOCALES[number]

export interface GenerationRequest {
  topic: string
  tone: Tone
  length: Length
  locale: EmailLocale
}

export interface GeneratedEmail {
  subject: string
  body: string
}

/**
 * The seam between the app and whatever writes the emails.
 *
 * The shipped build uses MockProvider, a deterministic local generator that
 * needs no API key. Swapping in a hosted model means adding one class that
 * implements this interface and pointing the factory at it — nothing above
 * this line changes.
 */
export interface EmailProvider {
  readonly id: string
  generate: (request: GenerationRequest) => Promise<GeneratedEmail>
}

export function isTone(value: unknown): value is Tone {
  return typeof value === 'string' && (TONES as readonly string[]).includes(value)
}

export function isLength(value: unknown): value is Length {
  return typeof value === 'string' && (LENGTHS as readonly string[]).includes(value)
}

export function isEmailLocale(value: unknown): value is EmailLocale {
  return typeof value === 'string' && (EMAIL_LOCALES as readonly string[]).includes(value)
}
