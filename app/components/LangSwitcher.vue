<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const options = computed(() =>
  (locales.value as { code: string, name: string }[]).map(l => ({
    code: l.code,
    name: l.name,
    short: l.code.toUpperCase(),
  })),
)
</script>

<template>
  <nav class="flex items-center gap-1" :aria-label="t('common.language')">
    <NuxtLink
      v-for="option in options"
      :key="option.code"
      :to="switchLocalePath(option.code)"
      class="px-2 py-1 rounded-md text-xs font-medium transition-colors"
      :class="locale === option.code
        ? 'bg-[var(--aeg-surface)] text-[var(--aeg-text)]'
        : 'text-[var(--aeg-muted)] hover:text-[var(--aeg-text)]'"
      :aria-current="locale === option.code ? 'true' : undefined"
    >
      {{ option.short }}
    </NuxtLink>
  </nav>
</template>
