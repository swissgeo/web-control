<script setup lang="ts">
const text = ref(useRuntimeConfig().public.environment.toUpperCase());
</script>

<template>
  <div
    class="pointer-events-auto fixed top-3 right-30 z-50 w-30 transform bg-red-600 py-2 text-center text-sm font-semibold text-white shadow-lg"
  >
    {{ text }}
  </div>
</template>
