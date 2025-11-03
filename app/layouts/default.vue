<script setup lang="ts"></script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <div class="flex items-center gap-8">
          <HeaderLogo />
          <h1 data-testid="global_title">Swissgeo Control</h1>
        </div>
      </template>
      <template #right>
        <UUser
          name="John Doe"
          :avatar="{
            icon: 'i-lucide-user',
          }"
        />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
    <UFooter class="bg-green-pastel-200">
      <template #left />

      <template #right>Swissgeo</template>
    </UFooter>
  </UApp>
</template>
