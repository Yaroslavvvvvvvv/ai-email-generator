<script setup lang="ts">
const props = defineProps<{
  result: { subject: string, body: string } | null
  pending?: boolean
}>()

const { t } = useI18n()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (!props.result) return

  const text = `${props.result.subject}\n\n${props.result.body}`
  try {
    await navigator.clipboard.writeText(text)
  }
  catch {
    // Clipboard access can be refused (insecure context, denied permission).
    // Selecting the text by hand still works, so this stays silent.
    return
  }

  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="rounded-2xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)] p-5 sm:p-6">
    <div class="flex items-center justify-between gap-3">
      <h2 class="font-semibold">{{ t('dashboard.result') }}</h2>
      <Button
        v-if="result"
        size="small"
        severity="secondary"
        outlined
        :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
        :label="copied ? t('dashboard.copied') : t('dashboard.copy')"
        @click="copy"
      />
    </div>

    <div v-if="pending" class="mt-4 space-y-3">
      <Skeleton height="1.25rem" width="60%" />
      <Skeleton height="0.9rem" />
      <Skeleton height="0.9rem" />
      <Skeleton height="0.9rem" width="80%" />
    </div>

    <div v-else-if="result" class="mt-4 space-y-4">
      <div>
        <div class="text-xs font-medium uppercase tracking-wide text-[var(--aeg-muted)]">
          {{ t('dashboard.subject') }}
        </div>
        <p class="mt-1 font-semibold">{{ result.subject }}</p>
      </div>
      <p class="whitespace-pre-line leading-relaxed">{{ result.body }}</p>
    </div>

    <div v-else class="mt-4 rounded-xl border border-dashed border-[var(--aeg-border)] p-8 text-center">
      <i class="pi pi-envelope text-2xl text-[var(--aeg-muted)]" />
      <p class="mt-3 font-medium">{{ t('dashboard.empty') }}</p>
      <p class="mt-1 text-sm text-[var(--aeg-muted)]">{{ t('dashboard.emptyHint') }}</p>
    </div>
  </section>
</template>
