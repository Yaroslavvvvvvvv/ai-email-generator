/**
 * End-to-end check against a running deployment: signs a throwaway user up,
 * walks the API with that session, and deletes the user again.
 *
 * Reads SUPABASE_URL, SUPABASE_KEY and SUPABASE_SERVICE_KEY from the
 * environment; target defaults to production, override with AEG_URL.
 *
 *   export $(grep -v '^#' .env | xargs) && node scripts/e2e.mjs
 */
const SB = process.env.SUPABASE_URL, ANON = process.env.SUPABASE_KEY, SVC = process.env.SUPABASE_SERVICE_KEY
const APP = process.env.AEG_URL || 'https://ai-email-generator-ruby.vercel.app'
const ref = new URL(SB).hostname.split('.')[0]
const email = `probe.${Date.now()}@aeg-probe.dev`
const ok = (b) => b ? '✅' : '❌'
let userId = null

try {
  const r = await fetch(`${SB}/auth/v1/signup`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'Probe12345!' }) })
  const j = await r.json()
  if (!r.ok) { console.log(`❌ signup ${r.status}: ${JSON.stringify(j)}`); process.exit(1) }
  const session = j.access_token ? j : null
  console.log(`${ok(session)} Реєстрація віддає сесію одразу (Confirm email вимкнено)`)
  if (!session) { console.log('   ' + JSON.stringify(j).slice(0, 200)); process.exit(1) }
  userId = j.user.id

  const cookie = `sb-${ref}-auth-token=base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`
  const call = async (path, init = {}) => {
    const res = await fetch(`${APP}${path}`, { ...init, headers: { cookie, 'Content-Type': 'application/json', ...(init.headers || {}) } })
    return { status: res.status, body: await res.json().catch(() => null) }
  }

  const health = await call('/api/health')
  console.log(`${ok(health.body?.ok && health.body.serverKey)} /api/health — змінні на місці ${JSON.stringify(health.body)}`)

  const u1 = await call('/api/usage')
  console.log(`${ok(u1.status === 200)} /api/usage ${u1.status} → ${JSON.stringify(u1.body)}`)

  const g = await call('/api/generate', { method: 'POST', body: JSON.stringify({ topic: 'нагадати про несплачений рахунок', tone: 'friendly', length: 'medium', locale: 'uk' }) })
  console.log(`${ok(g.status === 200)} /api/generate ${g.status} → тема: ${JSON.stringify(g.body?.subject)}`)
  if (g.body?.body) console.log(`   перший абзац: ${String(g.body.body).split('\n')[0].slice(0, 90)}…`)

  const anon = await fetch(`${APP}/api/usage`)
  console.log(`${ok(anon.status === 401)} /api/usage без сесії → ${anon.status} (має бути 401)`)
} finally {
  if (userId) {
    const d = await fetch(`${SB}/auth/v1/admin/users/${userId}`, { method: 'DELETE', headers: { apikey: SVC, Authorization: `Bearer ${SVC}` } })
    console.log(`${ok(d.status === 200)} пробний користувач видалений (${d.status})`)
  }
}
