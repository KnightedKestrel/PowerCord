<template>
    <header class="w-full border-b border-gray-800">
        <UContainer>
            <div class="flex h-16 items-center justify-between">
                <ULink to="/">
                    <div class="flex items-center gap-2">
                        <img
                            src="/assets/img/logo.png"
                            class="size-12 shrink-0 rounded-md"
                        />
                        <span class="text-2xl">PowerCord</span>
                    </div>
                </ULink>
                <div class="flex gap-4">
                    <ULink
                        to="https://volta.net/KnightedKestrel/PowerCord"
                        target="_blank"
                        external
                    >
                        Roadmap
                    </ULink>
                    <ULink
                        to="https://github.com/KnightedKestrel/PowerCord"
                        target="_blank"
                        external
                    >
                        Source
                    </ULink>
                    <ULink
                        to="https://discord.gg/MZfchrRah4"
                        target="_blank"
                        external
                    >
                        Support Server
                    </ULink>
                </div>
            </div>
        </UContainer>
    </header>
</template>
