// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },

    css: ['~/assets/scss/main.scss'],
    postcss: {
        plugins: {
            '@tailwindcss/postcss': {},
            autoprefixer: {},
        },
    },

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
});
