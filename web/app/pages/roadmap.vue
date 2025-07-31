<template>
    <div class="h-screen">
        <ClientOnly>
            <iframe :src="voltaBoardSrc" width="100%" height="100%"></iframe>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const colorMode = useColorMode();
const VOLTA_TOKEN =
    'eyJ2aWV3IjoiYm9hcmQiLCJib2FyZFN0YXR1c2VzIjpbImJhY2tsb2ciLCJkb25lIiwicmVsZWFzZWQiLCJjYW5jZWxsZWQiLCJ0b2RvIiwiaW5fcHJvZ3Jlc3MiLCJpbl9yZXZpZXciLCJ0cmlhZ2UiXSwiYm9hcmRMaW5rZWRQcnMiOnRydWUsImxpc3RHcm91cCI6InN0YXR1cyIsImxpc3RPcmRlciI6ImNyZWF0ZWRfYXQiLCJ0aW1lbGluZVpvb20iOiJtb250aCIsInRpbWVsaW5lT3JkZXIiOiJzdGF0ZSIsInRpbWVsaW5lRGlzcGxheSI6ImFsbF9taWxlc3RvbmVzIiwiZmlsdGVycyI6e30sIm93bmVyIjoiS25pZ2h0ZWRLZXN0cmVsIiwibmFtZSI6IlBvd2VyQ29yZCJ9';

const voltaBoardSrc = computed(() => {
    const voltaBaseUrl = `https://volta.net/embed/${VOLTA_TOKEN}`;
    return `${voltaBaseUrl}?theme=${colorMode.value}&primary=${appConfig.ui.colors.primary}&gray=${appConfig.ui.colors.neutral}`;
});
</script>
