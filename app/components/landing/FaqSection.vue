<script setup lang="ts">
const { t } = useI18n()
const items = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const
</script>

<template>
  <section id="faq" class="scroll-mt-20 border-b border-[var(--aeg-border)]">
    <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('faq.title') }}</h2>

      <Accordion class="mt-8" :value="['0']" multiple>
        <AccordionPanel v-for="(item, index) in items" :key="item" :value="String(index)">
          <AccordionHeader>{{ t(`faq.items.${item}.q`) }}</AccordionHeader>
          <AccordionContent>
            <p class="text-sm leading-relaxed text-[var(--aeg-muted)]">
              {{ t(`faq.items.${item}.a`) }}
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </section>
</template>
