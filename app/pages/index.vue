<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

const { setPageTitle } = useMeta();

const authStore = useAuthStore();

const usersName = computed(() => {
  return authStore.profile.given_name + " " + authStore.profile.family_name;
});

setPageTitle($t("index.title"));

const features = computed<PageFeatureProps[]>(() => [
  {
    title: $t("dataset.title"),
    description: $t("dataset.description"),
    icon: "i-lucide-database",
    to: "/datasets",
  },
  {
    title: $t("organization.title"),
    description: $t("organization.description"),
    icon: "i-lucide-settings",
    to: "/admin",
  },
  {
    title: $t("machineUser.title"),
    description: $t("machineUser.description"),
    icon: "i-lucide-server",
    to: "/admin/m2m",
  },
]);
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('global.home') + ' TEST'"
      :ui="{
        root: 'p-2',
      }"
    />
    <UPageBody>
      <UPageSection
        :ui="{ container: 'py-4! gap-4!' }"
        :title="$t('index.title') + ' ' + usersName"
        :description="$t('index.description')"
        :features="features"
      />
    </UPageBody>
  </UPage>
</template>
