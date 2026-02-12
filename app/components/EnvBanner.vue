<script setup lang="ts">
const text = ref(useRuntimeConfig().public.environment.toUpperCase());
</script>

<template>
  <div
    class="pointer-events-none, fixed top-0 right-0 z-50 h-16 w-60 overflow-hidden"
  >
    <div
      class="pointer-events-auto absolute top-3 right-30 w-30 transform bg-red-600 py-2 text-center text-sm font-semibold text-white shadow-lg"
    >
      {{ text }}
    </div>
  </div>
</template>
