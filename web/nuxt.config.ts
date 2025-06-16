// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },

    modules: [
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/test-utils',
        '@nuxt/ui',
        '@nuxt/fonts',
        '@nuxt/eslint',
        '@nuxt/content',
        '@nuxtjs/tailwindcss',
    ],

    css: ['~/assets/css/main.css'],
});
