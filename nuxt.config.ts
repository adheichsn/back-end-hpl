// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    GUEST_JWT_SECRET: process.env.GUEST_JWT_SECRET,
    HPL_MS_URL: process.env.HPL_MS_URL,
      public: {
      PUBLISH_BASE_URL: process.env.PUBLISH_BASE_URL || ""
    }
  }
})
