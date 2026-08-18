import type { EmailLocale, Tone } from '#shared/types/email'

export interface TonePhrases {
  /** Subject template. `{topic}` is replaced with a trimmed version of the topic. */
  subject: string
  greeting: string[]
  /** Opening paragraph. `{topic}` is replaced with the topic as typed. */
  opener: string[]
  /** Middle paragraphs. Length decides how many are used. */
  body: string[]
  /** The ask. Always the last paragraph before the sign-off. */
  cta: string[]
  signoff: string[]
}

export type LocalePhrases = Record<Tone, TonePhrases>
export type PhraseBank = Record<EmailLocale, LocalePhrases>
