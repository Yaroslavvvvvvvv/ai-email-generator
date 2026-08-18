import type {
  EmailProvider,
  GeneratedEmail,
  GenerationRequest,
  Length,
} from '#shared/types/email'
import { PHRASES } from './phrases'

/** Body paragraphs a reader sees, excluding greeting and sign-off. */
const PARAGRAPH_COUNT: Record<Length, number> = { short: 1, medium: 3, long: 5 }

const SUBJECT_MAX = 64

/** FNV-1a. Small, fast, and stable across runtimes — we only need spread, not secrecy. */
function hash(input: string): number {
  let h = 0x811C9DC5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/**
 * xorshift32 seeded from the request, so the same request always produces the
 * same email — which is what makes this provider testable — while a different
 * topic reaches for different phrases.
 */
function createPicker(seed: number) {
  let state = seed || 1

  function next(): number {
    state ^= (state << 13) >>> 0
    state >>>= 0
    state ^= state >>> 17
    state ^= (state << 5) >>> 0
    state >>>= 0
    return state
  }

  function pick<T>(list: readonly T[]): T {
    return list[next() % list.length] as T
  }

  /** Distinct items where possible; wraps around only if the pool is too small. */
  function take<T>(list: readonly T[], count: number): T[] {
    const pool = [...list]
    const out: T[] = []
    while (out.length < count) {
      if (pool.length === 0) pool.push(...list)
      out.push(pool.splice(next() % pool.length, 1)[0] as T)
    }
    return out
  }

  return { pick, take }
}

/** Turns a free-form topic into something that reads as a subject line. */
function toSubjectTopic(topic: string): string {
  const clean = topic.trim().replace(/\s+/g, ' ').replace(/[.!?,;:]+$/, '')
  if (clean.length <= SUBJECT_MAX) return clean

  const cut = clean.slice(0, SUBJECT_MAX)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > SUBJECT_MAX / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export interface MockProviderOptions {
  /** Simulated round-trip, so the loading state in the UI is a real one. */
  delayMs?: number
}

/**
 * Deterministic local generator. Assembles an email from tone-specific parts
 * instead of returning a canned text, so topic, tone and length all change the
 * result. Ships as the default provider: the app runs with no API key at all.
 */
export class MockProvider implements EmailProvider {
  readonly id = 'mock'

  constructor(private readonly options: MockProviderOptions = {}) {}

  async generate(request: GenerationRequest): Promise<GeneratedEmail> {
    const delay = this.options.delayMs ?? 350
    if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay))

    return this.compose(request)
  }

  /** Synchronous core, kept separate so tests can assert without waiting. */
  compose({ topic, tone, length, locale }: GenerationRequest): GeneratedEmail {
    const bank = PHRASES[locale][tone]
    const cleanTopic = topic.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '')
    const picker = createPicker(hash(`${locale}|${tone}|${length}|${cleanTopic}`))

    const opener = picker.pick(bank.opener).replace('{topic}', cleanTopic)
    const cta = picker.pick(bank.cta)
    const middleCount = Math.max(0, PARAGRAPH_COUNT[length] - 2)

    const paragraphs = length === 'short'
      // One paragraph has to carry both the reason and the ask.
      ? [`${opener} ${cta}`]
      : [opener, ...picker.take(bank.body, middleCount), cta]

    // Capitalise only when the topic opens the subject line: "Про Нагадати…"
    // reads as a typo, while "Нагадати…" on its own does not.
    const subjectTopic = toSubjectTopic(cleanTopic)
    const subject = bank.subject.replace(
      '{topic}',
      bank.subject.startsWith('{topic}') ? capitalise(subjectTopic) : subjectTopic,
    )
    const body = [picker.pick(bank.greeting), ...paragraphs, picker.pick(bank.signoff)].join('\n\n')

    return { subject, body }
  }
}
