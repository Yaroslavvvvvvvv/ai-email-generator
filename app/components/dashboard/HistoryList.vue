<script setup lang="ts">
export interface HistoryRow {
  id: string
  topic: string
  tone: string
  length: string
  subject: string
  body: string
  created_at: string
}

const PAGE_SIZE = 10

const { t, locale } = useI18n()
const supabase = useSupabaseClient()

const rows = ref<HistoryRow[]>([])
const expanded = ref<string | null>(null)
const confirming = ref<string | null>(null)
const pending = ref(true)
const error = ref('')
const hasMore = ref(false)

const formatter = computed(() => new Intl.DateTimeFormat(locale.value, {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
}))

async function load(reset = false) {
  if (reset) rows.value = []
  pending.value = true
  error.value = ''

  // Reads go straight to Supabase: row level security already limits the rows
  // to this account, so an API route in between would add nothing.
  const { data, error: queryError } = await supabase
    .from('generations')
    .select('id, topic, tone, length, subject, body, created_at')
    .order('created_at', { ascending: false })
    .range(rows.value.length, rows.value.length + PAGE_SIZE - 1)

  pending.value = false

  if (queryError) {
    error.value = t('errors.serverText')
    return
  }

  rows.value = [...rows.value, ...(data as HistoryRow[] ?? [])]
  hasMore.value = (data?.length ?? 0) === PAGE_SIZE
}

async function remove(id: string) {
  if (confirming.value !== id) {
    confirming.value = id
    setTimeout(() => {
      if (confirming.value === id) confirming.value = null
    }, 4000)
    return
  }

  confirming.value = null
  const previous = rows.value
  rows.value = rows.value.filter(row => row.id !== id)

  const { error: deleteError } = await supabase.from('generations').delete().eq('id', id)
  if (deleteError) {
    // Put it back rather than pretend: the row is still there.
    rows.value = previous
    error.value = t('errors.serverText')
  }
}

defineExpose({ reload: () => load(true) })
onMounted(() => load(true))
</script>

<template>
  <section class="rounded-2xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)] p-5 sm:p-6">
    <h2 class="font-semibold">{{ t('dashboard.history.title') }}</h2>

    <Message v-if="error" severity="error" :closable="false" size="small" class="mt-3">{{ error }}</Message>

    <div v-if="pending && !rows.length" class="mt-4 space-y-2">
      <Skeleton v-for="n in 3" :key="n" height="3.5rem" />
    </div>

    <p v-else-if="!rows.length" class="mt-4 text-sm text-[var(--aeg-muted)]">
      {{ t('dashboard.history.empty') }}
    </p>

    <ul v-else class="mt-4 space-y-2">
      <li
        v-for="row in rows"
        :key="row.id"
        class="rounded-xl border border-[var(--aeg-border)] bg-[var(--aeg-bg)]"
      >
        <div class="flex items-start gap-3 p-3">
          <button
            type="button"
            class="min-w-0 flex-1 text-left"
            :aria-expanded="expanded === row.id"
            @click="expanded = expanded === row.id ? null : row.id"
          >
            <span class="block truncate text-sm font-medium">{{ row.subject }}</span>
            <span class="mt-0.5 block text-xs text-[var(--aeg-muted)]">
              {{ t(`dashboard.tones.${row.tone}`) }} · {{ t(`dashboard.lengths.${row.length}`) }} ·
              {{ formatter.format(new Date(row.created_at)) }}
            </span>
          </button>

          <Button
            size="small"
            text
            :severity="confirming === row.id ? 'danger' : 'secondary'"
            :icon="confirming === row.id ? undefined : 'pi pi-trash'"
            :label="confirming === row.id ? t('dashboard.history.confirmDelete') : undefined"
            :aria-label="t('dashboard.history.delete')"
            @click="remove(row.id)"
          />
        </div>

        <p
          v-if="expanded === row.id"
          class="whitespace-pre-line border-t border-[var(--aeg-border)] p-3 text-sm leading-relaxed text-[var(--aeg-muted)]"
        >{{ row.body }}</p>
      </li>
    </ul>

    <Button
      v-if="hasMore"
      class="mt-4"
      size="small"
      severity="secondary"
      outlined
      :loading="pending"
      :label="t('dashboard.history.showMore')"
      @click="load()"
    />
  </section>
</template>
