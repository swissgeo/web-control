<script setup lang="ts">
const { setPageTitle } = useMeta();

setPageTitle($t("welcome"));
</script>

<template>
  <UPageSection>
    <div>{{ $t("welcome") }}</div>
  </UPageSection>
</template>
