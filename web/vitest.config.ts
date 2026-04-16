import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
    resolve: {
        dedupe: [
            'vue',
            '@vue/runtime-core',
            '@vue/runtime-dom',
            '@vue/reactivity',
        ],
    },
    test: {
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                domEnvironment: 'jsdom',
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            reportsDirectory: './coverage',
            include: [
                'components/**/*.{js,ts,vue}',
                'layouts/**/*.{js,ts,vue}',
                'pages/**/*.{js,ts,vue}',
            ],
        },
    },
});
