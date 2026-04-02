<script setup lang="ts">
import { format } from "date-fns";
import type { NavigationMenuItem } from "@nuxt/ui";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const authStore = useAuthStore();

const items = computed<NavigationMenuItem[]>(() => {
  const baseItems = [
    {
      label: $t("global.home"),
      icon: "i-lucide-house",
      to: "/",
      active: route.path === "/",
    },
  ];
  const datasetItems = [
    {
      label: $t("dataset.title"),
      to: "/datasets",
      icon: "i-lucide-database",
      active: route.path.startsWith("/datasets"),
    },
  ];
  const adminItems = [
    {
      label: $t("organization.title"),
      to: "/admin",
      icon: "i-lucide-settings",
      defaultOpen: true,
      type: "trigger",
      active: route.path.startsWith("/admin"),
      children: [
        {
          label: $t("organization.title"),
          icon: "i-lucide-settings",
          to: "/admin",
          active: route.path === "/admin",
        },
        {
          label: $t("unit.title"),
          icon: "i-lucide-square",
          to: "/admin/units",
          active: route.path.startsWith("/admin/units"),
        },
        {
          label: $t("user.title"),
          icon: "i-lucide-users",
          to: "/admin/users",
          active: route.path.startsWith("/admin/users"),
        },
        {
          label: $t("machineUser.title"),
          icon: "i-lucide-server",
          to: "/admin/m2m",
          active: route.path.startsWith("/admin/m2m"),
        },
      ],
    },
  ];
  let navigationItems = baseItems;
  if (authStore.canManageDatasets) {
    navigationItems = [...navigationItems, ...datasetItems];
  }
  if (authStore.canManageOrganization) {
    navigationItems = [...navigationItems, ...adminItems];
  }
  return navigationItems;
});
</script>

<template>
  <UDashboardGroup unit="rem">
    <EnvBanner v-if="runtimeConfig.public.environment !== 'prod'" />
    <UDashboardSidebar
      id="default"
      collapsible
      resizable
      class="bg-green-pastel-50"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <HeaderLogo :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
          popover
        />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel id="home">
      <template #header>
        <UDashboardNavbar class="bg-primary">
          <template #leading>
            <UDashboardSidebarCollapse class="text-inverted" />
          </template>

          <template #title>
            <UHeader class="bg-primary">
              <template #title>
                <!-- Applying text-inverted to UHeader does not take effect -->
                <span class="text-inverted">{{
                  $t("global.controlCenter")
                }}</span>
              </template>
            </UHeader>
          </template>

          <template #right>
            <UserAvatar v-if="authStore.isLoggedIn" />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
      <template #footer>
        <UFooter class="bg-secondary text-highlight">
          <template #left>
            <div class="flex flex-col">
              <div class="">
                {{
                  $t("global.version", {
                    version: runtimeConfig.public.commitHash,
                  })
                }}
              </div>
              <div>
                {{
                  $t("global.buildTime", {
                    timestamp: format(
                      runtimeConfig.public.buildTime,
                      "yyyy-MM-dd HH:mm",
                    ),
                  })
                }}
              </div>
            </div>
          </template>

          <template #right>
            <div class="flex flex-col">
              <div>{{ $t("global.swissgeo") }}</div>
              <div>
                <LanguageSwitcherButton />
              </div>
            </div>
          </template>
        </UFooter>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
