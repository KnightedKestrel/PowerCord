<template>
    <footer class="w-full border-t border-gray-800" role="contentinfo">
        <UContainer>
            <div class="flex h-16 items-center">
                <p class="text-muted">
                    Copyright &copy; 2024-{{ currentYear }} |
                    <ULink
                        to="https://github.com/KnightedKestrel/PowerCord/blob/master/LICENSE"
                        target="_blank"
                        class="text-white"
                        external
                        >AGPLv3</ULink
                    >
                </p>
            </div>
        </UContainer>
    </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

# Trivial change to trigger vercel build x5
