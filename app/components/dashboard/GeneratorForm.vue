<script setup lang="ts">
import { LENGTHS, TONES } from '#shared/types/email'
import type { Length, Tone } from '#shared/types/email'

const emit = defineEmits<{ generated: [] }>()
const model = defineModel<{ subject: string, body: string } | null>({ default: null })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { set, refresh } = useUsage()

const topic = ref('')
const tone = ref<Tone>('friendly')
const length = ref<Length>('medium')
const pending = ref(false)
const error = ref('')
const limitReached = ref(false)

const toneOptions = computed(() => TONES.map(value => ({
  value,
  label: t(`dashboard.tones.${value}`),
  hint: t(`dashboard.toneHints.${value}`),
})))

const lengthOptions = computed(() => LENGTHS.map(value => ({
  value,
  label: t(`dashboard.lengths.${value}`),
  hint: t(`dashboard.lengthHints.${value}`),
})))

/** The email follows the interface language — one selector, not two. */
const emailLocale = computed(() => (['en', 'uk', 'ru'].includes(locale.value) ? locale.value : 'en'))

async function generate() {
  error.value = ''
  limitReached.value = false

  if (topic.value.trim().length < 3) {
    error.value = t('dashboard.topicHint')
    return
  }

  pending.value = true
  try {
    const result = await $fetch<{ subject: string, body: string, used: number, limit: number | null }>('/api/generate', {
      method: 'POST',
      body: {
        topic: topic.value,
        tone: tone.value,
        length: length.value,
        locale: emailLocale.value,
      },
    })

    model.value = { subject: result.subject, body: result.body }
    set({
      used: result.used,
      limit: result.limit,
      remaining: result.limit === null ? null : Math.max(0, result.limit - result.used),
    })
    emit('generated')
  }
  catch (caught) {
    const status = (caught as { statusCode?: number, status?: number })?.statusCode
      ?? (caught as { status?: number })?.status

    if (status === 429) {
      limitReached.value = true
      await refresh()
    }
    else if (status === 401) {
      await navigateTo(localePath('/login'))
    }
    else {
      error.value = status ? t('errors.serverText') : t('errors.network')
    }
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="rounded-2xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)] p-5 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold tracking-tight sm:text-2xl">{{ t('dashboard.title') }}</h1>
        <p class="mt-1 text-sm text-[var(--aeg-muted)]">{{ t('dashboard.subtitle') }}</p>
      </div>
      <DashboardUsageBadge />
    </div>

    <form class="mt-6 space-y-5" novalidate @submit.prevent="generate">
      <div class="space-y-1.5">
        <label for="topic" class="text-sm font-medium">{{ t('dashboard.topic') }}</label>
        <Textarea
          id="topic"
          v-model="topic"
          rows="3"
          auto-resize
          maxlength="500"
          class="w-full"
          :placeholder="t('dashboard.topicPlaceholder')"
          :invalid="Boolean(error)"
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <fieldset class="space-y-2">
          <legend class="text-sm font-medium">{{ t('dashboard.tone') }}</legend>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in toneOptions"
              :key="option.value"
              type="button"
              class="rounded-lg border p-2.5 text-left transition-colors"
              :class="tone === option.value
                ? 'border-primary bg-primary/10'
                : 'border-[var(--aeg-border)] bg-[var(--aeg-bg)] hover:border-primary/40'"
              :aria-pressed="tone === option.value"
              @click="tone = option.value"
            >
              <span class="block text-sm font-medium">{{ option.label }}</span>
              <span class="block text-xs text-[var(--aeg-muted)]">{{ option.hint }}</span>
            </button>
          </div>
        </fieldset>

        <fieldset class="space-y-2">
          <legend class="text-sm font-medium">{{ t('dashboard.length') }}</legend>
          <div class="grid gap-2">
            <button
              v-for="option in lengthOptions"
              :key="option.value"
              type="button"
              class="flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors"
              :class="length === option.value
                ? 'border-primary bg-primary/10'
                : 'border-[var(--aeg-border)] bg-[var(--aeg-bg)] hover:border-primary/40'"
              :aria-pressed="length === option.value"
              @click="length = option.value"
            >
              <span class="text-sm font-medium">{{ option.label }}</span>
              <span class="text-xs text-[var(--aeg-muted)]">{{ option.hint }}</span>
            </button>
          </div>
        </fieldset>
      </div>

      <Message v-if="error" severity="error" :closable="false" size="small">{{ error }}</Message>

      <div v-if="limitReached" class="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
        <div class="flex items-start gap-3">
          <i class="pi pi-exclamation-triangle mt-0.5 text-amber-500" />
          <div class="space-y-2">
            <p class="font-medium">{{ t('dashboard.usage.limitTitle') }}</p>
            <p class="text-sm text-[var(--aeg-muted)]">{{ t('dashboard.usage.limitText') }}</p>
            <NuxtLink :to="localePath('/pricing')">
              <Button :label="t('dashboard.usage.seePricing')" size="small" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        class="w-full sm:w-auto"
        :loading="pending"
        :label="pending ? t('dashboard.generating') : (model ? t('dashboard.regenerate') : t('dashboard.generate'))"
        :icon="pending ? undefined : 'pi pi-sparkles'"
      />
    </form>
  </section>
</template>
