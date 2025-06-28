<template>
    <header class="w-full border-b border-gray-800" role="banner">
        <UContainer>
            <div class="flex h-16 items-center justify-between">
                <ULink to="/">
                    <div class="flex items-center gap-2">
                        <img
                            src="/assets/img/logo.png"
                            class="size-12 shrink-0 rounded-md"
                            alt="PowerCord logo"
                        />
                        <span class="logo-text text-3xl text-white"
                            >PowerCord</span
                        >
                    </div>
                </ULink>

                <UNavigationMenu :items="navItems" class="hidden md:block" />

                <!-- Mobile navigation menu -->
                <USlideover
                    :close="{
                        color: 'neutral',
                        variant: 'subtle',
                        class: 'text-lg',
                    }"
                    class="md:hidden"
                >
                    <UButton
                        icon="i-lucide:menu"
                        size="xl"
                        color="neutral"
                        variant="subtle"
                        aria-label="Open navigation menu"
                    />

                    <template #body>
                        <UNavigationMenu
                            :items="navItems"
                            orientation="vertical"
                            class="-mx-2.5"
                        />
                    </template>
                </USlideover>
            </div>
        </UContainer>
    </header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { ref } from 'vue';

const navItems = ref<NavigationMenuItem[][]>([
    [
        {
            label: 'Roadmap',
            icon: 'i-lucide-map',
            to: 'https://volta.net/KnightedKestrel/PowerCord',
            target: '_blank',
        },
        {
            label: 'Source',
            icon: 'i-simple-icons-github',
            to: 'https://volta.net/KnightedKestrel/PowerCord',
            target: '_blank',
        },
        {
            label: 'Support Server',
            icon: 'i-simple-icons-discord',
            to: 'https://discord.gg/MZfchrRah4',
            target: '_blank',
        },
    ],
]);
</script>

<style lang="scss" scoped>
.logo-text {
    font-family: 'Kanit';
}
</style>
