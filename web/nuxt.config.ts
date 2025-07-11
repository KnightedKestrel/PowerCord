// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },
    app: {
        head: {
            title: 'PowerCord | Powerlifting competition results in Discord', // Default fallback title
            htmlAttrs: {
                lang: 'en',
            },
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
        '@nuxtjs/tailwindcss',
    ],

    css: ['~/assets/css/main.css'],
});
