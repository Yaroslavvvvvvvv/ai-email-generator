export interface Usage {
  used: number
  limit: number | null
  remaining: number | null
  isPremium: boolean
}

/**
 * Today's counter. Shared across the dashboard, the profile and the pricing
 * page through `useState`, so pressing Generate updates all of them at once.
 */
export function useUsage() {
  const usage = useState<Usage | null>('aeg-usage', () => null)
  const pending = useState('aeg-usage-pending', () => false)

  async function refresh() {
    pending.value = true
    try {
      usage.value = await $fetch<Usage>('/api/usage')
    }
    catch {
      // A missing counter must not take the dashboard down with it: the form
      // stays usable and the API is the one that enforces the limit anyway.
      usage.value = null
    }
    finally {
      pending.value = false
    }
  }

  function set(next: Partial<Usage>) {
    usage.value = { ...(usage.value ?? { used: 0, limit: null, remaining: null, isPremium: false }), ...next }
  }

  return { usage, pending, refresh, set }
}
