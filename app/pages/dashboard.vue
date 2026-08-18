<script setup lang="ts">
const { t } = useI18n()
const { refresh } = useUsage()

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: () => `${t('dashboard.title')} — AI Email Generator`, robots: 'noindex' })

const result = ref<{ subject: string, body: string } | null>(null)
const history = ref<{ reload: () => void } | null>(null)

await refresh()

function onGenerated() {
  history.value?.reload()
}
</script>

<template>
  <div class="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-12">
    <div class="space-y-6">
      <DashboardGeneratorForm v-model="result" @generated="onGenerated" />
      <DashboardResultCard :result="result" />
    </div>

    <DashboardHistoryList ref="history" class="lg:sticky lg:top-24 lg:self-start" />
  </div>
</template>
