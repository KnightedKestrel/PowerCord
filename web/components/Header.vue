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
                <nav class="flex items-center gap-4" role="navigation">
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
                    <UButton
                        to="https://discord.gg/MZfchrRah4"
                        target="_blank"
                        size="lg"
                        variant="subtle"
                        class="text-md"
                        >Join Support Server</UButton
                    >
                </nav>
            </div>
        </UContainer>
    </header>
</template>

<style lang="scss" scoped>
.logo-text {
    font-family: 'Kanit';
}
</style>
