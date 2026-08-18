<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
})
</script>

<template>
  <div>
    <LandingTheHero />
    <LandingFeatureGrid />
    <LandingHowItWorks />
    <LandingFaqSection />
    <LandingCtaSection />
  </div>
</template>
