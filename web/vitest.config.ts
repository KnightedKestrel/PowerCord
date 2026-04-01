import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
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
