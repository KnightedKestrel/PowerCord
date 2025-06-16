<template>
    <footer class="w-full border-t border-gray-800">
        <UContainer>
            <div class="flex h-16 items-center">
                <p class="text-muted">
                    Copyright &copy; 2024-{{ currentYear }}
                </p>
            </div>
        </UContainer>
    </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>
