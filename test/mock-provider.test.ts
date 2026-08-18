import { describe, expect, it } from 'vitest'
import { EMAIL_LOCALES, LENGTHS, TONES } from '#shared/types/email'
import type { EmailLocale, Length, Tone } from '#shared/types/email'
import { MockProvider } from '~~/server/lib/email/mock-provider'

const provider = new MockProvider({ delayMs: 0 })

const base = {
  topic: 'remind the landlord about the broken heating, second time',
  tone: 'direct' as Tone,
  length: 'medium' as Length,
  locale: 'en' as EmailLocale,
}

/** Body paragraphs the reader sees, ignoring greeting and sign-off. */
function paragraphCount(body: string): number {
  return body.split('\n\n').length - 2
}

describe('MockProvider', () => {
  it('puts the topic into the subject', () => {
    const { subject } = provider.compose(base)
    expect(subject.toLowerCase()).toContain('remind the landlord')
  })

  it('puts the topic into the body', () => {
    const { body } = provider.compose(base)
    expect(body).toContain(base.topic)
  })

  it('gives short one paragraph, medium three, long five', () => {
    const counts = LENGTHS.map(length => paragraphCount(provider.compose({ ...base, length }).body))
    expect(counts).toEqual([1, 3, 5])
  })

  it('changes the wording when the tone changes', () => {
    const bodies = TONES.map(tone => provider.compose({ ...base, tone }).body)
    expect(new Set(bodies).size).toBe(TONES.length)
  })

  it('changes the wording when the topic changes', () => {
    const a = provider.compose(base).body
    const b = provider.compose({ ...base, topic: 'ask for a raise before the review' }).body
    expect(a).not.toBe(b)
  })

  it('is deterministic — the same request gives the same email', () => {
    expect(provider.compose(base)).toEqual(provider.compose(base))
  })

  it('writes in the requested language', () => {
    const cyrillic = /[Ѐ-ӿ]/
    expect(cyrillic.test(provider.compose({ ...base, locale: 'en' }).body)).toBe(false)
    expect(cyrillic.test(provider.compose({ ...base, locale: 'uk' }).body)).toBe(true)
    expect(cyrillic.test(provider.compose({ ...base, locale: 'ru' }).body)).toBe(true)
  })

  it('trims a long topic in the subject but keeps the body intact', () => {
    const long = 'follow up on the unpaid invoice from May and also clarify the delivery terms for the next quarter'
    const { subject, body } = provider.compose({ ...base, topic: long })
    expect(subject.length).toBeLessThanOrEqual(80)
    expect(body).toContain(long)
  })

  it('leaves no unfilled placeholders in any combination', () => {
    for (const locale of EMAIL_LOCALES) {
      for (const tone of TONES) {
        for (const length of LENGTHS) {
          const { subject, body } = provider.compose({ ...base, locale, tone, length })
          expect(`${subject} ${body}`, `${locale}/${tone}/${length}`).not.toContain('{topic}')
          expect(subject.trim().length, `${locale}/${tone}/${length}`).toBeGreaterThan(0)
          expect(body.trim().length, `${locale}/${tone}/${length}`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('does not repeat a paragraph inside one email', () => {
    const { body } = provider.compose({ ...base, length: 'long' })
    const paragraphs = body.split('\n\n')
    expect(new Set(paragraphs).size).toBe(paragraphs.length)
  })
})
