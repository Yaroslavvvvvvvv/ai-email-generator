<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ middleware: 'guest' })
useSeoMeta({ title: () => `${t('auth.registerTitle')} — AI Email Generator` })
</script>

<template>
  <AuthCard mode="register" />
</template>
