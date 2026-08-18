<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const user = useSupabaseUser()
const { usage, refresh, set } = useUsage()

useSeoMeta({
  title: () => `${t('pricing.title')} — AI Email Generator`,
  description: () => t('pricing.subtitle'),
})

const pending = ref<'free' | 'premium' | null>(null)
const notice = ref('')
const error = ref('')

if (user.value) await refresh()

const isPremium = computed(() => usage.value?.isPremium ?? false)

const plans = computed(() => ([
  {
    id: 'free' as const,
    name: t('pricing.free.name'),
    price: t('pricing.free.price'),
    tagline: t('pricing.free.tagline'),
    features: (tm('pricing.free.features') as unknown[]).map(item => rt(item as never)),
    highlighted: false,
  },
  {
    id: 'premium' as const,
    name: t('pricing.premium.name'),
    price: t('pricing.premium.price'),
    tagline: t('pricing.premium.tagline'),
    features: (tm('pricing.premium.features') as unknown[]).map(item => rt(item as never)),
    highlighted: true,
  },
]))

function isCurrent(plan: 'free' | 'premium') {
  if (!user.value || !usage.value) return false
  return plan === 'premium' ? isPremium.value : !isPremium.value
}

async function choose(plan: 'free' | 'premium') {
  if (!user.value) {
    await navigateTo(localePath('/register'))
    return
  }

  pending.value = plan
  notice.value = ''
  error.value = ''

  try {
    const { isPremium: next } = await $fetch<{ isPremium: boolean }>('/api/upgrade', {
      method: 'POST',
      body: { plan },
    })
    set({ isPremium: next })
    await refresh()
    notice.value = next ? t('pricing.upgraded') : t('pricing.downgraded')
  }
  catch {
    error.value = t('errors.serverText')
  }
  finally {
    pending.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16 sm:px-6">
    <header class="text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('pricing.title') }}</h1>
      <p class="mx-auto mt-3 max-w-xl text-lg text-[var(--aeg-muted)]">{{ t('pricing.subtitle') }}</p>
    </header>

    <Message v-if="notice" severity="success" :closable="false" class="mx-auto mt-6 max-w-xl">{{ notice }}</Message>
    <Message v-if="error" severity="error" :closable="false" class="mx-auto mt-6 max-w-xl">{{ error }}</Message>

    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="flex flex-col rounded-2xl border p-6"
        :class="plan.highlighted
          ? 'border-primary bg-[var(--aeg-surface)] shadow-lg shadow-primary/10'
          : 'border-[var(--aeg-border)] bg-[var(--aeg-surface)]'"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ plan.name }}</h2>
          <span
            v-if="isCurrent(plan.id)"
            class="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary"
          >{{ t('pricing.current') }}</span>
        </div>

        <p class="mt-1 text-sm text-[var(--aeg-muted)]">{{ plan.tagline }}</p>

        <p class="mt-5">
          <span class="text-4xl font-bold tracking-tight">{{ plan.price }}</span>
          <span class="text-sm text-[var(--aeg-muted)]">{{ t('pricing.perMonth') }}</span>
        </p>

        <ul class="mt-6 flex-1 space-y-2.5">
          <li v-for="feature in plan.features" :key="String(feature)" class="flex items-start gap-2 text-sm">
            <i class="pi pi-check mt-0.5 text-xs text-primary" />
            <span>{{ feature }}</span>
          </li>
        </ul>

        <Button
          class="mt-6 w-full"
          :severity="plan.highlighted ? 'primary' : 'secondary'"
          :outlined="!plan.highlighted"
          :disabled="isCurrent(plan.id)"
          :loading="pending === plan.id"
          :label="!user
            ? t('pricing.signInFirst')
            : isCurrent(plan.id)
              ? t('pricing.current')
              : plan.id === 'premium' ? t('pricing.upgrade') : t('pricing.downgrade')"
          @click="choose(plan.id)"
        />
      </article>
    </div>

    <p class="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--aeg-muted)]">
      <i class="pi pi-info-circle mr-1 text-xs" />{{ t('pricing.demoNote') }}
    </p>
  </div>
</template>
