import type { PhraseBank } from './types'
import { en } from './en'
import { ru } from './ru'
import { uk } from './uk'

export const PHRASES: PhraseBank = { en, uk, ru }
export type { LocalePhrases, PhraseBank, TonePhrases } from './types'
