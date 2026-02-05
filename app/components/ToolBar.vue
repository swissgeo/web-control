<template>
  <div class="flex flex-wrap items-center justify-between gap-1.5">
    <slot />

    <div v-if="$slots.right" class="flex flex-wrap items-center gap-1.5">
      <slot name="right" />
    </div>
  </div>
</template>
