# AI Email Generator

Describe what the email is about, pick a tone and a length, get something you
can send. Built as a 48-hour test assignment.

**Live:** https://ai-email-generator-ruby.vercel.app

---

## Running it

```bash
git clone https://github.com/Yaroslavvvvvvvv/ai-email-generator.git
cd ai-email-generator
npm install
cp .env.example .env     # fill in the three Supabase values
npm run dev              # http://localhost:3000
```

```bash
npm run build            # production build
npm test                 # unit tests
npm run lint             # eslint
```

With Docker:

```bash
docker compose up --build     # http://localhost:3000
```

### Environment

| Variable | What it is |
|---|---|
| `SUPABASE_URL` | Project URL from Supabase → Project Settings → API Keys |
| `SUPABASE_KEY` | Publishable (anon) key — reaches the browser by design |
| `SUPABASE_SERVICE_KEY` | Secret (service_role) key — server only, bypasses row level security |

### Database

Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL
editor. It creates three tables, their row level security policies, the trigger
that gives every new account a profile, and the function that spends a daily
generation.

**No API key is needed to run the app.** Email generation ships with a local
provider (see below), so a fresh clone works end to end.

---

## Stack

| | |
|---|---|
| Framework | Nuxt 4 (SSR) + Nitro |
| Language | TypeScript |
| UI | PrimeVue 4 (Aura preset) + Tailwind CSS 4 |
| Auth & data | Supabase (Postgres + Auth) |
| i18n | `@nuxtjs/i18n` — English, Ukrainian, Russian |
| Tests | Vitest |
| Hosting | Vercel |

---

## Structure

```
app/
  components/            AppHeader, AppFooter, LangSwitcher, ThemeToggle, AuthCard
    landing/             hero, feature grid, steps, FAQ, CTA
    dashboard/           generator form, result card, history, usage badge
  composables/           useUsage, useAuthErrors
  middleware/            auth (signed in only), guest (signed out only)
  pages/                 index, login, register, dashboard, pricing, profile
  error.vue              404 and 500
server/
  api/                   generate, usage, upgrade, health
  lib/email/             provider factory, MockProvider, phrase banks per locale
  utils/auth.ts          user id from JWT claims
shared/types/email.ts    tones, lengths, EmailProvider — shared by client and server
i18n/locales/            en.json, uk.json, ru.json
supabase/schema.sql      tables, RLS policies, trigger, limit function
test/                    unit tests
```

---

## Decisions

### Generation sits behind an interface

`EmailProvider` is one method: `generate(request) → { subject, body }`.
`createEmailProvider()` is the only place that picks an implementation.
Swapping the local generator for a hosted model means adding a class and
editing that one function — the API route, the dashboard and the types stay
untouched.

### The mock assembles emails, it does not store them

A canned text per combination would mean the topic field changes nothing, which
is visible in about ten seconds. Instead `MockProvider` builds each email from
tone-specific parts: greeting → opener carrying the topic → body paragraphs →
the ask → sign-off. Length decides the paragraph count (1 / 3 / 5). The picks
are seeded by a hash of the request, so the same request always returns the
same email — which is what makes it testable — while a different topic reaches
for different phrasing.

### The browser never writes

Reads go straight to Supabase, where row level security already limits rows to
the signed-in account. Every write goes through a Nitro route holding the
secret key. That is what makes the daily counter something a user cannot argue
with: `usage_days` has no write policy at all, so it cannot be edited from the
client, and deleting an email from history does not hand back a spent
generation.

### Checking the limit and spending it are one statement

`consume_generation` does both inside a single `insert … on conflict … where`.
Two tabs pressing Generate at the same moment cannot both pass a check that
happens before the write.

### Premium is real, the payment is not

The assignment does not require Stripe. Upgrade sets `is_premium` server side
and the limit genuinely disappears; the charge is imagined and the pricing page
says so. Connecting a checkout means calling the same route from a webhook
instead of from the button.

### The email follows the interface language

One language selector, not two. Adding a separate output language would have
tripled the phrase banks for a field most people would never touch.

### PrimeVue is pinned to 4.5.5

PrimeVue 5 requires a PrimeUI licence key and paints a red banner into a closed
shadow root without one. 4.5.5 is the last MIT release.

### Route protection is hand-written

`@nuxtjs/supabase` can guard routes by path, but with localised prefixes every
protected path exists three times over. Two small middlewares — `auth` and
`guest` — read the session and redirect through `localePath` instead.

---

## What tests cover

The generator, because it is deterministic and it is where the product lives:
that the topic reaches both subject and body, that each tone produces different
wording, that lengths give 1 / 3 / 5 paragraphs, that every one of the 36
locale × tone × length combinations comes out complete, and that no paragraph
repeats inside a single email.

The daily limit is enforced in Postgres and was verified against the live
database rather than mocked.

---

## Known gaps

- Sign-in is email and password only; no OAuth, no password reset.
- History deletion is permanent and has no undo beyond a confirm step.
- The counter resets at midnight UTC, not in the user's own timezone.
