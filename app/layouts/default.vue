<script setup lang="ts">
import { format } from "date-fns";

const runtimeConfig = useRuntimeConfig();
</script>

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
      <template #left>
        <div class="flex flex-col">
          <div class="">Version: {{ runtimeConfig.public.commit_hash }}</div>
          <div>
            Build time:
            {{ format(runtimeConfig.public.build_time, "yyyy-MM-dd HH:mm") }}
          </div>
        </div>
      </template>

      <template #right>Swissgeo</template>
    </UFooter>
  </UApp>
</template>
