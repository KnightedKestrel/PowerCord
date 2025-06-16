<template>
    <div class="flex h-screen flex-col justify-between">
        <Header />
        <slot />
        <Footer />
    </div>
</template>

<style lang="scss">
body {
    background-color: var(--color-gray-900);
}
</style>
