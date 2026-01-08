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
    label: "Units",
    icon: "i-lucide-house",
    to: "/admin/units",
    active: route.path.startsWith("/admin/units"),
  },
  {
    label: "Users",
    icon: "i-lucide-users",
    to: "/admin/users",
    active: route.path.startsWith("/admin/users"),
  },
  {
    label: "M2M",
    icon: "i-lucide-server",
    to: "/admin/m2m",
    active: route.path.startsWith("/admin/m2m"),
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
      <UNavigationMenu :items="items" class="w-full justify-center" />
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
