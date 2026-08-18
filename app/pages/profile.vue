<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { usage, refresh } = useUsage()

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: () => `${t('profile.title')} — AI Email Generator`, robots: 'noindex' })

await refresh()

const { data: total } = await useAsyncData('generations-total', async () => {
  const { count } = await supabase
    .from('generations')
    .select('id', { count: 'exact', head: true })
  return count ?? 0
}, { default: () => 0 })

const memberSince = computed(() => {
  if (!user.value?.created_at) return '—'
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(user.value.created_at))
})

const signingOut = ref(false)

async function signOut() {
  signingOut.value = true
  await supabase.auth.signOut()
  await navigateTo(localePath('/'))
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6">
    <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ t('profile.title') }}</h1>

    <dl class="mt-8 divide-y divide-[var(--aeg-border)] rounded-2xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)]">
      <div class="flex items-center justify-between gap-4 p-4">
        <dt class="text-sm text-[var(--aeg-muted)]">{{ t('profile.email') }}</dt>
        <dd class="truncate font-medium">{{ user?.email }}</dd>
      </div>

      <div class="flex items-center justify-between gap-4 p-4">
        <dt class="text-sm text-[var(--aeg-muted)]">{{ t('profile.plan') }}</dt>
        <dd class="flex items-center gap-3">
          <span class="font-medium">
            {{ usage?.isPremium ? t('profile.planPremium') : t('profile.planFree') }}
          </span>
          <NuxtLink :to="localePath('/pricing')" class="text-sm text-primary hover:underline">
            {{ t('profile.managePlan') }}
          </NuxtLink>
        </dd>
      </div>

      <div class="flex items-center justify-between gap-4 p-4">
        <dt class="text-sm text-[var(--aeg-muted)]">{{ t('profile.usedToday') }}</dt>
        <dd class="font-medium">
          <template v-if="usage?.isPremium">{{ usage.used }} · {{ t('dashboard.usage.unlimited') }}</template>
          <template v-else>{{ usage?.used ?? 0 }} / {{ usage?.limit ?? 0 }}</template>
        </dd>
      </div>

      <div class="flex items-center justify-between gap-4 p-4">
        <dt class="text-sm text-[var(--aeg-muted)]">{{ t('profile.generated') }}</dt>
        <dd class="font-medium">{{ total }}</dd>
      </div>

      <div class="flex items-center justify-between gap-4 p-4">
        <dt class="text-sm text-[var(--aeg-muted)]">{{ t('profile.memberSince') }}</dt>
        <dd class="font-medium">{{ memberSince }}</dd>
      </div>
    </dl>

    <Button
      class="mt-6"
      severity="secondary"
      outlined
      icon="pi pi-sign-out"
      :loading="signingOut"
      :label="t('auth.signOut')"
      @click="signOut"
    />
  </div>
</template>
