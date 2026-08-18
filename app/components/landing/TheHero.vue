<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="relative overflow-hidden border-b border-[var(--aeg-border)]">
    <!-- A single soft glow behind the headline; the accent is a signal, not decor. -->
    <div
      class="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
      <div class="space-y-6">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-[var(--aeg-border)] bg-[var(--aeg-surface)] px-3 py-1 text-xs text-[var(--aeg-muted)]"
        >
          <i class="pi pi-sparkles text-[0.7rem]" />
          {{ t('hero.badge') }}
        </span>

        <h1 class="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {{ t('hero.title') }}
        </h1>

        <p class="max-w-xl text-lg leading-relaxed text-[var(--aeg-muted)]">
          {{ t('hero.subtitle') }}
        </p>

        <div class="flex flex-col gap-3 sm:flex-row">
          <NuxtLink :to="localePath('/register')">
            <Button :label="t('hero.ctaPrimary')" icon="pi pi-arrow-right" icon-pos="right" size="large" class="w-full sm:w-auto" />
          </NuxtLink>
          <NuxtLink to="#how">
            <Button :label="t('hero.ctaSecondary')" severity="secondary" outlined size="large" class="w-full sm:w-auto" />
          </NuxtLink>
        </div>

        <p class="text-sm text-[var(--aeg-muted)]">
          <i class="pi pi-check-circle mr-1 text-xs" />{{ t('hero.note') }}
        </p>
      </div>

      <LandingPreviewCard />
    </div>
  </section>
</template>
