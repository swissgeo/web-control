<script setup lang="ts">
defineProps<{
  collapsed?: boolean;
}>();
</script>

<template>
  <SvgoSwissgeoRgbIcon
    v-if="collapsed"
    class="h-5 text-black"
    :font-controlled="false"
  />
  <SvgoSwissgeoRgbSek
    v-if="!collapsed"
    data-testid="header-logo"
    class="h-5 text-black"
    :font-controlled="false"
  />
</template>
