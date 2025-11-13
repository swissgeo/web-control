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

const items: DropdownMenuItem[] = [
  [
    {
      label: authStore.username,
      type: "label",
    },
  ],
  [
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
      v-if="authStore.isLoggedIn"
      class="cursor-pointer"
      :avatar="{
        icon: 'i-lucide-user',
      }"
    />
  </UDropdownMenu>
</template>
