<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <!-- A still of the real dashboard, so the promise on the left is visible on the right. -->
  <div
    class="rounded-2xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)] p-4 shadow-xl shadow-black/5 sm:p-6"
    aria-hidden="true"
  >
    <div class="space-y-4">
      <div class="space-y-1.5">
        <div class="text-xs font-medium uppercase tracking-wide text-[var(--aeg-muted)]">
          {{ t('preview.topicLabel') }}
        </div>
        <div class="rounded-lg border border-[var(--aeg-border)] bg-[var(--aeg-bg)] px-3 py-2 text-sm">
          {{ t('preview.topic') }}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <div class="text-xs font-medium uppercase tracking-wide text-[var(--aeg-muted)]">
            {{ t('preview.toneLabel') }}
          </div>
          <div class="rounded-lg border border-[var(--aeg-border)] bg-[var(--aeg-bg)] px-3 py-2 text-sm">
            {{ t('preview.tone') }}
          </div>
        </div>
        <div class="space-y-1.5">
          <div class="text-xs font-medium uppercase tracking-wide text-[var(--aeg-muted)]">
            {{ t('preview.lengthLabel') }}
          </div>
          <div class="rounded-lg border border-[var(--aeg-border)] bg-[var(--aeg-bg)] px-3 py-2 text-sm">
            {{ t('preview.length') }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-contrast">
        {{ t('preview.button') }}
      </div>

      <div class="rounded-lg border border-primary/40 bg-[var(--aeg-bg)] p-4">
        <div class="mb-2 text-sm font-semibold">{{ t('preview.subject') }}</div>
        <p class="whitespace-pre-line text-sm leading-relaxed text-[var(--aeg-muted)]">{{ t('preview.body') }}</p>
      </div>
    </div>
  </div>
</template>
