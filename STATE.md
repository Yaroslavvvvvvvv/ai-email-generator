# Стан проєкту

Тестове завдання **Vibe Coder / AI-First Developer** — MVP AI Email Generator за 48 годин.
Бюджет: 40 робочих годин. Витрачено ≈ 4.

- **Прод:** https://ai-email-generator-ruby.vercel.app
- **Репозиторій:** https://github.com/Yaroslavvvvvvvv/ai-email-generator (публічний, гілка `main`)
- **Supabase:** проєкт `ai-email-generator`, `tlzkrtlxuhkpvldphcmp`, West EU (Ireland)

## Що зроблено

| № ТЗ | Пункт | Стан |
|---|---|---|
| 1 | Landing page | ✅ hero · опис · переваги · 3 кроки · FAQ · CTA · адаптив |
| 2 | Авторизація | ✅ реєстрація, вхід, вихід, захист маршрутів |
| 3 | Dashboard | ✅ тема · 4 тони · 3 довжини · Generate · результат · історія |
| 4 | AI Generation | ✅ `MockProvider` за інтерфейсом `EmailProvider` |
| 5 | Premium | ✅ Pricing, Upgrade знімає ліміт, без Stripe |
| 6 | Profile | ✅ пошта, тариф, лічильники, дата реєстрації, вихід |
| 7 | Error handling | ✅ 404/500 сторінка, 401, 422, 429 — без білих екранів |
| 8 | Responsive | ⚠️ верстка адаптивна, **на реальних розмірах не перевірена** |
| 9 | Deploy | ✅ Vercel, автодеплой з кожного push |

З блоку «буде плюсом»: Docker ✅, CI/CD ✅, тести ✅, TypeScript ✅,
розділення компонентів ✅, три мови ✅, дві теми ✅.
**shadcn/ui немає** — свідомо, обрано PrimeVue.

**11 тестів проходять. ESLint чистий. CI зелений. Образ Docker зібраний і перевірений.**

## Що лишилось

**1. ~~Два налаштування в Supabase~~ — зроблено 18 серпня.**
`Confirm email` вимкнено, `Site URL` і `Redirect URLs` переведені на прод-домен.
Перевірено наскрізь на проді: реєстрація віддає сесію одразу, `/api/usage`,
`/api/generate` і 401 без сесії відповідають як слід.

**2. Пройти застосунок руками в браузері.** API перевірений наскрізь скриптом
`scripts/e2e.mjs` (локально, у контейнері й на проді), але **жодну кнопку жодна
людина ще не натискала**. Особливо: мобільна ширина, перемикач теми на кожному
екрані, перемикач мов у дашборді.

**3. ~~AI Development Report~~ — зроблено 18 серпня.** Чистовий текст російською —
`AI-REPORT.md` у корені, посилання стоїть у README. Сировина лишилась у
`docs/ai-report.md` як слід процесу. Звіт вичитаний на секрети — ключа в ньому немає.

**4. Дрібне:**
- ~~прибрати тестових користувачів із Supabase~~ — зроблено 18 серпня: видалені всі три
  акаунти, каскад підчистив `profiles`, `generations`, `usage_days` до нуля рядків;
- ~~перевірити вихід із преміуму~~ — серверний шлях перевірений на проді
  (`scripts/premium.mjs`): Upgrade знімає ліміт, сім генерацій поспіль проходять,
  вихід повертає ліміт, а восьма впирається в 429, бо витрачено 7 при ліміті 5.
  **Кнопки на сторінці Pricing усе ще руками не тиснуті** — це частина пункту 2.

## Рішення, які не обговорюються заново

Прийняті автором **проти** моєї рекомендації — і це свідомо:

| Питання | Моя порада | Рішення автора |
|---|---|---|
| Фреймворк | Next.js + shadcn/ui | **Nuxt 4** — щоб могти захистити код на співбесіді |
| Бібліотека UI | shadcn-vue | **PrimeVue** — знає з п'яти робочих проєктів |
| Модель | Anthropic за $5 + mock | **лише mock** |
| Теми | одна темна | **дві з перемикачем** |
| Мови | uk + en | **uk + ru + en**, лист — мовою інтерфейсу |
| Назва продукту | `Tonemail` | **без назви**, «AI Email Generator» |
| AI-звіт | вести живцем | **зібрати наприкінці** |
| Секретний ключ Supabase | прокрутити перед звітом | **лишити як є** |

Інше, вирішене й закрите:
- ліміт **5 генерацій на добу**, Upgrade його знімає (без платіжки);
- поля тільки тема / тон / довжина — **«тип листа» не додаємо**, воно множиться на все;
- README англійською, **AI-звіт російською**;
- деплой із першої години, кожен push іде в прод;
- **секретний ключ не крутимо** (18 серпня). Він лежить відкритим у
  `~/.claude/history.jsonl` і в стенограмі сесії з каталогу `-Users-mac-WebstormProjects`;
  у git не потрапляв, на GitHub його немає, база порожня. Звідси зобовʼязання:
  **кожен фрагмент стенограми вичитується на секрети перед тим, як потрапити в AI-звіт** —
  саме там ключ і має шанс поїхати в чужі руки.

## Запуск

```bash
cd ~/WebstormProjects/ai-email-generator
npm install
npm run dev        # http://localhost:3000
npm test           # 11 тестів
npm run lint
npm run build
docker compose up --build
```

`.env` уже заповнений (у git не потрапляє). У Vercel ті самі три змінні задані
**лише для Production** — для Preview і Development їх немає.

## Пастки, на яких це вже ламалося

- **`npm 10.9.3` має баг резолвера** — `Cannot read properties of null (reading 'edgesOut')`.
  Полагоджено підняттям до `11.19.0` (новіший вимагає node ≥ 22.22, у системі 22.20).
- **PrimeVue 5 платний** — малює червону плашку `Invalid PrimeUI License` у closed shadow root.
  Прибито пінами `primevue@4.5.5`, `@primevue/nuxt-module@4.5.5`, `@primeuix/themes@2`.
- **`serverSupabaseUser` віддає claims JWT, а не User** — ідентифікатор у `sub`, не в `id`.
  `undefined` мовчки доїжджав до Postgres. Винесено в `server/utils/auth.ts` → `requireUserId`.
- **`return query` у PL/pgSQL не завершує функцію** — відмова й дозвіл поверталися разом,
  преміум списував генерацію двічі. Виправлено в `supabase/002-fix-consume-generation.sql`.
- **Nitro не читає `.env` у продакшн-збірці** — локально `node .output/server/index.mjs`
  запускати тільки з `export $(grep -v '^#' .env | xargs)`.
- **Змінні у Vercel не діють без Redeploy** — Nuxt запікає їх у збірку.
  `/api/health` показує, чи вони на місці, не розкриваючи значень.
- **Тема листа — дієслівна фраза.** Будь-який шаблон мусить вводити її через двокрапку
  або починати з неї, інакше виходить «Про нагадати про рахунок» чи «About remind the
  landlord». Ловилося вже двічі, тому винесено в тест
  «introduces the topic instead of gluing it onto a preposition».
- **Велика літера в темі листа** ставиться лише коли `{topic}` починає рядок,
  інакше виходить «Про Нагадати».
- **`UID` — зарезервована змінна в цій оболонці**, присвоєння падає з `bad math expression`.

## Структура

```
app/
  components/          AppHeader · AppFooter · LangSwitcher · ThemeToggle · AuthCard
    landing/           TheHero · PreviewCard · FeatureGrid · HowItWorks · FaqSection · CtaSection
    dashboard/         GeneratorForm · ResultCard · HistoryList · UsageBadge
  composables/         useUsage · useAuthErrors
  middleware/          auth · guest
  pages/               index · login · register · dashboard · pricing · profile
  error.vue            404 і 500
server/
  api/                 generate.post · usage.get · upgrade.post · health.get
  lib/email/           index (фабрика) · mock-provider · phrases/{en,uk,ru,types}
  utils/auth.ts        requireUserId
shared/types/email.ts  TONES · LENGTHS · EmailProvider — спільне для клієнта й сервера
i18n/locales/          en · uk · ru — 166 ключів, парність перевіряється скриптом
supabase/              schema.sql · 002-fix-consume-generation.sql
test/                  mock-provider.test.ts — 11 тестів
scripts/e2e.mjs        наскрізна перевірка живого деплою, прибирає за собою
scripts/premium.mjs    перевірка преміуму: зняття ліміту, вихід, поведінка на межі
AI-REPORT.md           чистовий AI Development Report (російською)
docs/ai-report.md      сировина для нього, лишена як слід процесу
```

## Архітектурні опори

- **Браузер ніколи не пише.** Читання йде напряму в Supabase під RLS; кожен запис —
  через маршрут Nitro із секретним ключем. Тому лічильник ліміту не обійти:
  в `usage_days` немає жодної політики на запис, а видалення листа з історії
  не повертає витрачену генерацію.
- **Перевірка й списання ліміту — один оператор** (`insert … on conflict … where`).
  Дві вкладки, що тиснуть Generate одночасно, не проскочать повз перевірку.
- **`EmailProvider` — єдиний шов.** `createEmailProvider()` — єдине місце, яке знає,
  хто пише листи. Заміна mock на хмарну модель не чіпає нічого вище.
- **`MockProvider` збирає лист із частин**, а не віддає заготовку: тема проростає
  в тему листа й перший абзац, тон чути з першого речення, довжина дає 1/3/5 абзаців.
  Вибір фраз засіяний хешем запиту — той самий запит дає той самий лист, тому його
  можна тестувати.
