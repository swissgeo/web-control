<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();
const textColor = "text-red-600";
</script>

<template>
  <NuxtLayout>
    <UError
      :error="error"
      :ui="{ statusMessage: textColor, statusCode: textColor }"
    />
  </NuxtLayout>
</template>
