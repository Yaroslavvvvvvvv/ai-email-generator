import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

/**
 * The signed-in user's id, or a 401.
 *
 * `serverSupabaseUser` returns JWT claims, not a User row — the id lives in
 * `sub`. Reading `.id` yields undefined, which travels all the way to Postgres
 * before anything complains, so every route goes through here instead.
 */
export async function requireUserId(event: H3Event): Promise<string> {
  const claims = await serverSupabaseUser(event)
  const id = claims?.sub

  if (!id) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorised' })
  }

  return id
}
