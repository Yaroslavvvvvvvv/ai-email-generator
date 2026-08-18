import type { EmailProvider } from '#shared/types/email'
import { MockProvider } from './mock-provider'

/**
 * The only place that knows which provider is in use.
 *
 * To move from the local generator to a hosted model, add a class implementing
 * `EmailProvider` (one `generate` method) and return it here — every caller
 * upstream, including the API route and the dashboard, stays untouched.
 */
export function createEmailProvider(): EmailProvider {
  return new MockProvider()
}

export { MockProvider } from './mock-provider'
export { PHRASES } from './phrases'
