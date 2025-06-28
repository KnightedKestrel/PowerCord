<template>
    <div class="flex h-screen flex-col justify-between">
        <Header />
        <main role="main">
            <slot />
        </main>
        <Footer />
    </div>
</template>

<style lang="scss">
body {
    background-color: var(--color-gray-900);
}
</style>
