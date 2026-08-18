<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/10 blur-3xl"
      aria-hidden="true"
    />
    <div class="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('cta.title') }}</h2>
      <p class="mx-auto mt-3 max-w-xl text-lg text-[var(--aeg-muted)]">{{ t('cta.subtitle') }}</p>
      <NuxtLink :to="localePath('/register')" class="mt-8 inline-block">
        <Button :label="t('cta.button')" icon="pi pi-arrow-right" icon-pos="right" size="large" />
      </NuxtLink>
    </div>
  </section>
</template>
