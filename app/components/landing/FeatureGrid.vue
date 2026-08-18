<script setup lang="ts">
const { t } = useI18n()

const features = [
  { key: 'tone', icon: 'pi pi-sliders-h' },
  { key: 'length', icon: 'pi pi-align-left' },
  { key: 'speed', icon: 'pi pi-bolt' },
  { key: 'history', icon: 'pi pi-history' },
  { key: 'languages', icon: 'pi pi-globe' },
  { key: 'privacy', icon: 'pi pi-lock' },
] as const
</script>

<template>
  <section id="features" class="scroll-mt-20 border-b border-[var(--aeg-border)]">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div class="max-w-2xl space-y-3">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('features.title') }}</h2>
        <p class="text-lg text-[var(--aeg-muted)]">{{ t('features.subtitle') }}</p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="feature in features"
          :key="feature.key"
          class="rounded-xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)] p-5 transition-colors hover:border-primary/50"
        >
          <span class="grid size-10 place-items-center rounded-lg border border-[var(--aeg-border)] bg-[var(--aeg-bg)]">
            <i :class="feature.icon" class="text-[var(--aeg-muted)]" />
          </span>
          <h3 class="mt-4 font-semibold">{{ t(`features.items.${feature.key}.title`) }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-[var(--aeg-muted)]">
            {{ t(`features.items.${feature.key}.text`) }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
