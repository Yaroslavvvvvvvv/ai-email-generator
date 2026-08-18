<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const open = ref(false)

const links = computed(() => [
  { label: t('nav.features'), to: '#features' },
  { label: t('nav.how'), to: '#how' },
  { label: t('nav.pricing'), to: localePath('/pricing') },
  { label: t('nav.faq'), to: '#faq' },
])
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-[var(--aeg-border)] bg-[var(--aeg-bg)]/85 backdrop-blur"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2 font-semibold">
        <span class="grid size-8 place-items-center rounded-lg bg-primary text-primary-contrast">
          <i class="pi pi-envelope text-sm" />
        </span>
        <span class="hidden sm:inline">AI Email Generator</span>
      </NuxtLink>

      <nav class="ml-auto hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-3 py-2 text-sm text-[var(--aeg-muted)] transition-colors hover:text-[var(--aeg-text)]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <LangSwitcher class="hidden sm:flex" />
        <ThemeToggle />
        <NuxtLink :to="localePath('/login')" class="hidden sm:block">
          <Button :label="t('nav.signIn')" text severity="secondary" size="small" />
        </NuxtLink>
        <NuxtLink :to="localePath('/register')" class="hidden sm:block">
          <Button :label="t('nav.getStarted')" size="small" />
        </NuxtLink>
        <Button
          class="md:hidden"
          text
          rounded
          severity="secondary"
          aria-label="Menu"
          @click="open = !open"
        >
          <i :class="open ? 'pi pi-times' : 'pi pi-bars'" />
        </Button>
      </div>
    </div>

    <div
      v-if="open"
      class="border-t border-[var(--aeg-border)] bg-[var(--aeg-bg)] px-4 py-3 md:hidden"
    >
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-3 py-2 text-sm text-[var(--aeg-muted)]"
          @click="open = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div class="mt-3 flex items-center justify-between border-t border-[var(--aeg-border)] pt-3">
        <LangSwitcher />
        <div class="flex gap-2">
          <NuxtLink :to="localePath('/login')" @click="open = false">
            <Button :label="t('nav.signIn')" text severity="secondary" size="small" />
          </NuxtLink>
          <NuxtLink :to="localePath('/register')" @click="open = false">
            <Button :label="t('nav.getStarted')" size="small" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
