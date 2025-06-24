<template>
    <main class="flex h-screen flex-col justify-between" role="main">
        <Header />
        <slot />
        <Footer />
    </main>
</template>

<style lang="scss">
body {
    background-color: var(--color-gray-900);
}
</style>
