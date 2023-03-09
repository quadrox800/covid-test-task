import { defineNuxtConfig } from "nuxt/config"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    '@/assets/css/styles.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [ //instead of buildModules
    '@pinia/nuxt'
  ],
})