<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'register'
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const supabase = useSupabaseClient()
const describeError = useAuthErrors()

const email = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const notice = ref('')

const isRegister = computed(() => props.mode === 'register')

async function submit() {
  error.value = ''
  notice.value = ''

  if (!email.value.trim() || !password.value) {
    error.value = t('auth.errors.required')
    return
  }

  pending.value = true
  try {
    const credentials = { email: email.value.trim(), password: password.value }
    const { data, error: authError } = isRegister.value
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials)

    if (authError) {
      error.value = describeError(authError)
      return
    }

    // With email confirmation switched on, sign-up returns a user but no
    // session — sending them to the dashboard would just bounce them back.
    if (isRegister.value && !data.session) {
      notice.value = t('auth.checkEmail')
      return
    }

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await navigateTo(redirect ?? localePath('/dashboard'))
  }
  catch (caught) {
    error.value = describeError(caught)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
    <div class="rounded-2xl border border-[var(--aeg-border)] bg-[var(--aeg-surface)] p-6 sm:p-8">
      <h1 class="text-2xl font-bold tracking-tight">
        {{ isRegister ? t('auth.registerTitle') : t('auth.loginTitle') }}
      </h1>
      <p class="mt-1.5 text-sm text-[var(--aeg-muted)]">
        {{ isRegister ? t('auth.registerSubtitle') : t('auth.loginSubtitle') }}
      </p>

      <form class="mt-6 space-y-4" novalidate @submit.prevent="submit">
        <div class="space-y-1.5">
          <label for="email" class="text-sm font-medium">{{ t('auth.email') }}</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full"
            :invalid="Boolean(error)"
          />
        </div>

        <div class="space-y-1.5">
          <label for="password" class="text-sm font-medium">{{ t('auth.password') }}</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggle-mask
            :input-props="{ autocomplete: isRegister ? 'new-password' : 'current-password' }"
            class="w-full"
            input-class="w-full"
            :invalid="Boolean(error)"
          />
          <p v-if="isRegister" class="text-xs text-[var(--aeg-muted)]">{{ t('auth.passwordHint') }}</p>
        </div>

        <Message v-if="error" severity="error" :closable="false" size="small">{{ error }}</Message>
        <Message v-if="notice" severity="info" :closable="false" size="small">{{ notice }}</Message>

        <Button
          type="submit"
          class="w-full"
          :loading="pending"
          :label="pending ? undefined : (isRegister ? t('auth.signUp') : t('auth.signIn'))"
        />
      </form>

      <p class="mt-6 text-center text-sm text-[var(--aeg-muted)]">
        <template v-if="isRegister">
          {{ t('auth.haveAccount') }}
          <NuxtLink :to="localePath('/login')" class="text-primary hover:underline">{{ t('auth.signIn') }}</NuxtLink>
        </template>
        <template v-else>
          {{ t('auth.noAccount') }}
          <NuxtLink :to="localePath('/register')" class="text-primary hover:underline">{{ t('auth.signUp') }}</NuxtLink>
        </template>
      </p>
    </div>
  </div>
</template>
