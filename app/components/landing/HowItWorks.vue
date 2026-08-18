<script setup lang="ts">
const { t } = useI18n()
const steps = ['one', 'two', 'three'] as const
</script>

<template>
  <section id="how" class="scroll-mt-20 border-b border-[var(--aeg-border)] bg-[var(--aeg-surface)]">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('how.title') }}</h2>

      <ol class="mt-10 grid gap-6 md:grid-cols-3">
        <li
          v-for="(step, index) in steps"
          :key="step"
          class="relative rounded-xl border border-[var(--aeg-border)] bg-[var(--aeg-bg)] p-6"
        >
          <span class="grid size-9 place-items-center rounded-full bg-primary font-semibold text-primary-contrast">
            {{ index + 1 }}
          </span>
          <h3 class="mt-4 font-semibold">{{ t(`how.steps.${step}.title`) }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-[var(--aeg-muted)]">
            {{ t(`how.steps.${step}.text`) }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
