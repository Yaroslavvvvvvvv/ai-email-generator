import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import tailwindcss from '@tailwindcss/vite'

// One accent for the whole product: a quiet blue that signals results and
// primary actions. Everything else stays neutral on purpose.
const AegPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef4ff',
      100: '#d9e6ff',
      200: '#bcd3ff',
      300: '#8fb6ff',
      400: '#5b90fb',
      500: '#356df0',
      600: '#1f4fd6',
      700: '#1a3eae',
      800: '#1b378c',
      900: '#1c3272',
      950: '#152046',
    },
  },
})

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
  ],

  css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],

  runtimeConfig: {
    public: {
      freeDailyLimit: 5,
    },
  },

  // Route protection is ours, not the module's: with localised prefixes the
  // module's path matching would have to list every locale separately.
  supabase: {
    redirect: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  primevue: {
    options: {
      theme: {
        preset: AegPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    storageKey: 'aeg-color-mode',
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'uk', language: 'uk-UA', name: 'Українська', file: 'uk.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'aeg-locale',
      redirectOn: 'root',
    },
  },
})
