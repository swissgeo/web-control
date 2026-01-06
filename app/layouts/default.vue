<script setup lang="ts">
import { format } from "date-fns";
import type { NavigationMenuItem } from "@nuxt/ui";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Users",
    icon: "i-lucide-users",
    to: "/admin/m2m",
    active: route.path.startsWith("/admin"),
  },
]);
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <div class="flex items-center gap-8">
          <HeaderLogo />
          <h1 data-testid="global_title">SWISSGEO Control</h1>
        </div>
      </template>
      <UNavigationMenu :items="items" />
      <template #right>
        <UserAvatar />
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
          <div class="">Version: {{ runtimeConfig.public.commitHash }}</div>
          <div>
            Build time:
            {{ format(runtimeConfig.public.buildTime, "yyyy-MM-dd HH:mm") }}
          </div>
        </div>
      </template>

      <template #right>SWISSGEO</template>
    </UFooter>
  </UApp>
</template>
