<script setup lang="ts">
const colorMode = useColorMode()
const { t } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <Button
    text
    rounded
    severity="secondary"
    :aria-label="t('common.theme')"
    @click="toggle"
  >
    <!-- The icon depends on the resolved theme, which the server cannot know. -->
    <ClientOnly>
      <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
      <template #fallback>
        <i class="pi pi-moon" />
      </template>
    </ClientOnly>
  </Button>
</template>
