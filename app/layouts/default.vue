<script setup lang="ts"></script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <div class="flex items-center gap-8">
          <Logo />
          <h1>Swissgeo Control</h1>
        </div>
      </template>
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
    <UFooter>
      <template #left />

      <template #right>Swissgeo</template>
    </UFooter>
  </UApp>
</template>
