<script lang="ts" setup>
const { locales, setLocale } = useI18n();
</script>

<template>
  <div class="divide-x">
    <a
      v-for="locale in locales"
      :key="locale.code"
      href="#"
      class="pr-2 pl-2 uppercase first:pl-0"
      @click.prevent.stop="setLocale(locale.code)"
    >
      {{ locale.code }}
    </a>
  </div>
</template>
