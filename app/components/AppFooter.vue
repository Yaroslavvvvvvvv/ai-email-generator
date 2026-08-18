<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-[var(--aeg-border)] bg-[var(--aeg-surface)]">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
      <div class="max-w-xs space-y-2">
        <div class="flex items-center gap-2 font-semibold">
          <span class="grid size-7 place-items-center rounded-lg bg-primary text-primary-contrast">
            <i class="pi pi-envelope text-xs" />
          </span>
          AI Email Generator
        </div>
        <p class="text-sm text-[var(--aeg-muted)]">{{ t('footer.tagline') }}</p>
      </div>

      <div class="flex gap-12">
        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-wide text-[var(--aeg-muted)]">
            {{ t('footer.product') }}
          </div>
          <NuxtLink :to="localePath('/pricing')" class="block text-sm hover:underline">
            {{ t('nav.pricing') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/dashboard')" class="block text-sm hover:underline">
            {{ t('nav.dashboard') }}
          </NuxtLink>
        </div>
        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-wide text-[var(--aeg-muted)]">
            {{ t('footer.legal') }}
          </div>
          <span class="block text-sm text-[var(--aeg-muted)]">{{ t('footer.terms') }}</span>
          <span class="block text-sm text-[var(--aeg-muted)]">{{ t('footer.privacy') }}</span>
        </div>
      </div>
    </div>

    <div class="border-t border-[var(--aeg-border)] px-4 py-4 text-center text-xs text-[var(--aeg-muted)] sm:px-6">
      © {{ year }} · {{ t('footer.rights') }}
    </div>
  </footer>
</template>
