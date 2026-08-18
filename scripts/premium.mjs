/**
 * Premium path against a running deployment: upgrade lifts the daily limit,
 * leaving premium puts it back, and a user who overspent while premium is
 * refused afterwards rather than handed a negative allowance.
 *
 * Signs a throwaway user up and deletes it again. Reads SUPABASE_URL,
 * SUPABASE_KEY and SUPABASE_SERVICE_KEY from the environment.
 *
 *   export $(grep -v '^#' .env | xargs) && node scripts/premium.mjs
 */
const SB = process.env.SUPABASE_URL, ANON = process.env.SUPABASE_KEY, SVC = process.env.SUPABASE_SERVICE_KEY
const APP = process.env.AEG_URL || 'https://ai-email-generator-ruby.vercel.app'
const ref = new URL(SB).hostname.split('.')[0]
const ok = b => b ? '✅' : '❌'
let id = null
try {
  const r = await fetch(`${SB}/auth/v1/signup`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: `probe.${Date.now()}@aeg-probe.dev`, password: 'Probe12345!' }) })
  const s = await r.json(); id = s.user.id
  const cookie = `sb-${ref}-auth-token=base64-${Buffer.from(JSON.stringify(s)).toString('base64url')}`
  const call = async (p, init = {}) => { const res = await fetch(`${APP}${p}`, { ...init, headers: { cookie, 'Content-Type': 'application/json' } }); return { status: res.status, body: await res.json().catch(() => null) } }

  const gen = () => call('/api/generate', { method: 'POST', body: JSON.stringify({ topic: 'нагадати про рахунок', tone: 'formal', length: 'short', locale: 'uk' }) })

  console.log(`${ok((await call('/api/usage')).body?.limit === 5)} старт: ліміт 5`)

  const up = await call('/api/upgrade', { method: 'POST', body: JSON.stringify({ plan: 'premium' }) })
  const afterUp = (await call('/api/usage')).body
  console.log(`${ok(up.body?.isPremium && afterUp.limit === null)} Upgrade → преміум, ліміт знято (${JSON.stringify(afterUp)})`)

  let spent = 0
  for (let i = 0; i < 7; i++) if ((await gen()).status === 200) spent++
  console.log(`${ok(spent === 7)} преміум: 7 генерацій поспіль пройшли (${spent}/7) — ліміт справді не діє`)

  const down = await call('/api/upgrade', { method: 'POST', body: JSON.stringify({ plan: 'free' }) })
  const afterDown = (await call('/api/usage')).body
  console.log(`${ok(down.body?.isPremium === false && afterDown.limit === 5)} Вихід із преміуму → ліміт повернувся (${JSON.stringify(afterDown)})`)

  const blocked = await gen()
  console.log(`${ok(blocked.status === 429)} після виходу восьма генерація → ${blocked.status} (має бути 429, витрачено вже 7 із 5)`)
} finally {
  if (id) console.log(`${ok((await fetch(`${SB}/auth/v1/admin/users/${id}`, { method: 'DELETE', headers: { apikey: SVC, Authorization: `Bearer ${SVC}` } })).status === 200)} пробний користувач видалений`)
}
