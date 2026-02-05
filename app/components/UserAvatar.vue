<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const authStore = useAuthStore();
const router = useRouter();

const logoutRoute = computed(() => {
  const logoutRoute = router
    .getRoutes()
    .find((route) => route.name == "auth-logout");

  if (!logoutRoute) {
    throw new Error("No logout route found");
  }

  return logoutRoute;
});

const name = computed(() => {
  return authStore.profile.given_name + " " + authStore.profile.family_name;
});

const items: DropdownMenuItem[] = [
  [
    {
      label: name,
      type: "label",
    },
  ],
  [
    {
      label: $t("profile"),
      icon: "i-lucide-user-round",
      to: { name: "profile" },
    },
    {
      label: $t("logout"),
      icon: "i-lucide-log-out",
      to: logoutRoute,
    },
  ],
];
</script>

<template>
  <UDropdownMenu :items="items">
    <UUser
      class="cursor-pointer"
      :avatar="{
        icon: 'i-lucide-user',
      }"
    />
  </UDropdownMenu>
</template>
