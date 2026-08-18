<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()

const isNotFound = computed(() => props.error?.statusCode === 404)

// `clearError` unmounts this page; without a redirect the user lands back on
// whatever failed. Home is the one route guaranteed to work.
function goHome() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[var(--aeg-bg)] text-[var(--aeg-text)]">
    <main class="flex flex-1 items-center justify-center px-4 py-16">
      <div class="max-w-md text-center">
        <p class="text-6xl font-bold tracking-tight text-primary">{{ error?.statusCode ?? 500 }}</p>
        <h1 class="mt-4 text-2xl font-bold tracking-tight">
          {{ isNotFound ? t('errors.notFoundTitle') : t('errors.serverTitle') }}
        </h1>
        <p class="mt-2 text-[var(--aeg-muted)]">
          {{ isNotFound ? t('errors.notFoundText') : t('errors.serverText') }}
        </p>
        <Button class="mt-8" :label="t('errors.home')" icon="pi pi-home" @click="goHome" />
      </div>
    </main>
  </div>
</template>
