<script setup lang="ts">
const { setPageTitle } = useMeta();

setPageTitle("Login");
</script>

<template>
  <div>
    <UPageSection>
      <UButton icon="i-lucide-external-link">Primary</UButton>
      <UButton icon="i-lucide-external-link" color="secondary"
        >Secondary</UButton
      >
    </UPageSection>
    <UPageSection> THIS IS A PR TEST </UPageSection>
  </div>
</template>
