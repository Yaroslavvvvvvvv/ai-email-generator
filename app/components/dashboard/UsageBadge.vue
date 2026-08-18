<script setup lang="ts">
const { t } = useI18n()
const { usage } = useUsage()
</script>

<template>
  <div v-if="usage" class="flex items-center gap-2 text-sm">
    <template v-if="usage.isPremium">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 font-medium text-primary">
        <i class="pi pi-star-fill text-[0.7rem]" />{{ t('dashboard.usage.premium') }}
      </span>
      <span class="text-[var(--aeg-muted)]">{{ t('dashboard.usage.unlimited') }}</span>
    </template>
    <span v-else class="text-[var(--aeg-muted)]">
      {{ t('dashboard.usage.left', { count: usage.remaining, limit: usage.limit }) }}
    </span>
  </div>
</template>
