<template>
    <UContainer>
        <div class="my-20">
            <div class="my-12 flex items-center justify-between gap-2">
                <div class="mb-16 flex flex-col gap-6">
                    <h1 class="text-4xl">
                        Powerlifting competition results in
                        <img
                            class="my-1 h-12"
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
                            class="btn text-lg"
                            >Add to Discord</UButton
                        >
                        <UButton
                            to="https://github.com/KnightedKestrel/PowerCord"
                            target="_blank"
                            size="xl"
                            icon="line-md:github-twotone"
                            variant="outline"
                            class="btn text-lg"
                            >View on GitHub</UButton
                        >
                    </div>
                    <span
                        ><ULink
                            to="https://www.openpowerlifting.org/"
                            target="_blank"
                            class="text-primary"
                            external
                            >Data provided by OpenPowerlifting
                            <UIcon
                                name="fe:link-external"
                                class="size-5" /></ULink
                    ></span>
                </div>

                <div class="max-h-120 relative overflow-y-hidden">
                    <img
                        class="max-h-240 h-full w-full object-cover"
                        src="/assets/img/preview-showcase.png"
                        alt="Screenshot preview showcase for couple commands in Discord"
                    />
                    <div
                        class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"
                    ></div>
                </div>
            </div>

            <div class="flex gap-4">
                <div v-for="feature in features" class="flex-1">
                    <div
                        class="ring-default flex h-full flex-col gap-y-2 rounded-xl bg-gray-800 px-4 py-5 shadow-xl ring"
                    >
                        <UIcon
                            v-if="feature.icon"
                            :name="feature.icon"
                            class="text-primary text-3xl"
                        />
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

useSeoMeta({
    ogTitle: 'PowerCord - The Powerlifting Discord Bot',
    ogDescription:
        'View Powerlifting meet results, lifter profiles, and top totals in your own server! Powered by data provided by OpenPowerlifting.org and completely open source.',
    ogImage: 'https://powercord-gilt.vercel.app/ogImage.png',
});

const features = ref([
    {
        title: 'Zero Configuration',
        details:
            'Simply invite the bot to your server and start using commands in Discord right away.',
        icon: 'line-md:speed-twotone',
    },
    {
        title: 'Always Up-to-date',
        details:
            'Built to grab all the latest meet results from the OPL Data Service nightly.',
        icon: 'line-md:download-twotone',
    },
    {
        title: 'Open Source',
        details:
            'Completely open source and available on GitHub for self-hosting or contributions.',
        icon: 'line-md:cloud-alt-tags-twotone',
    },
    {
        title: 'Support Available',
        details:
            'Join our support server for help on usage or hosting. Feedback also welcome!',
        icon: 'line-md:heart-twotone-half-filled',
    },
]);
</script>
