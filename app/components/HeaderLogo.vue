<script setup lang="ts">
defineProps<{
  collapsed?: boolean;
}>();
</script>

<template>
  <SvgoLogo
    v-if="collapsed"
    data-testid="header-logo-collapsed"
    class="h-5 text-black"
    :font-controlled="false"
  />
  <SvgoSwissgeoSwSek
    v-if="!collapsed"
    data-testid="header-logo"
    class="h-5 text-black"
    :font-controlled="false"
  />
</template>
