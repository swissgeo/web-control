<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

const { setPageTitle } = useMeta();

const authStore = useAuthStore();

const usersName = computed(() => {
  return authStore.profile.given_name + " " + authStore.profile.family_name;
});

setPageTitle($t("welcome"));

const features = ref<PageFeatureProps[]>([
  {
    title: "Datasets",
    description: "Manage your geospatial datasets, including metadata.",
    icon: "i-lucide-database",
    to: "/datasets",
  },
  {
    title: "Organization",
    description: "Manage your organization's structure and permissions.",
    icon: "i-lucide-settings",
    to: "/admin",
  },
  {
    title: "Machine Users",
    description: "Manage your machine users and their permissions.",
    icon: "i-lucide-server",
    to: "/admin/m2m",
  },
]);
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('Home')"
      :ui="{
        root: 'p-2',
      }"
    />
    <UPageBody>
      <UPageSection
        :ui="{ container: 'py-4! gap-4!' }"
        :title="$t('welcome') + ' ' + usersName"
        description="This is the control center of the SWISSGEO. Use the
            navigation on the left to access different sections of the app."
        :features="features"
      />
    </UPageBody>
  </UPage>
</template>
