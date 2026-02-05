<script setup lang="ts">
defineProps<{
  collapsed?: boolean;
}>();
</script>

<template>
  <!-- we need to explicitly set the text to black, otherwsie the fill color
   of some of the pixels changes when switching to tark mode-->
  <SvgoLogo v-if="collapsed" class="h-5 text-black" :font-controlled="false" />
  <SvgoSwissgeoSwSek
    v-if="!collapsed"
    class="h-5 text-black"
    :font-controlled="false"
  />
</template>
