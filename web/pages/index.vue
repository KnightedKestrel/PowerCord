<template>
    <UContainer>
        <div class="my-20">
            <div class="mb-16 flex flex-col gap-6">
                <h1 class="text-5xl">
                    Powerlifting competition results in
                    <img
                        class="my-1 h-10"
                        src="/assets/img/discord-logo.svg"
                        alt="Discord"
                    />
                </h1>
                <p class="text-xl">
                    View powerlifting meet data, lifter profiles, and more!
                </p>
                <div class="flex gap-4">
                    <UButton
                        to="https://discord.com/oauth2/authorize?client_id=1306740469484486697&permissions=0&scope=bot%20applications.commands"
                        target="_blank"
                        size="xl"
                        icon="line-md:discord-twotone"
                        >Add to Discord</UButton
                    >
                    <UButton
                        to="https://github.com/KnightedKestrel/PowerCord"
                        target="_blank"
                        size="xl"
                        icon="line-md:github-twotone"
                        variant="outline"
                        >View on GitHub</UButton
                    >
                </div>
                <ULink to="https://www.openpowerlifting.org/" external
                    >Data provided by OpenPowerlifting
                    <UIcon name="fe:link-external" class="size-5"
                /></ULink>
            </div>

            <div class="flex gap-4">
                <div v-for="feature in features" class="flex-1">
                    <div
                        class="ring-default flex h-full flex-col gap-y-2 rounded-xl px-4 py-5 ring"
                    >
                        <h2 class="text-highlighted text-xl font-semibold">
                            {{ feature.title }}
                        </h2>
                        <p class="text-muted">{{ feature.details }}</p>
                    </div>
                </div>
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const features = ref([
    {
        title: 'Zero Configuration',
        details:
            'Simply invite the bot to your server and start using commands in Discord right away.',
    },
    {
        title: 'Always Up-to-date',
        details:
            'Built to grab all the latest meet results from the OPL Data Service nightly.',
    },
    {
        title: 'Open Source',
        details:
            'Completely open source and available on GitHub for self-hosting or contributions.',
    },
    {
        title: 'Support Available',
        details:
            'Join our support server for help on usage or hosting. Feedback also welcome!',
    },
]);
</script>
