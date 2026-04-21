<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

const { setPageTitle } = useMeta();

const authStore = useAuthStore();

const usersName = computed(() => {
  return authStore.profile.firstName + " " + authStore.profile.lastName;
});

setPageTitle($t("index.title"));

const features = computed<PageFeatureProps[]>(() => {
  let features: PageFeatureProps[] = [];
  if (authStore.canManageDatasets) {
    features = features.concat([
      {
        title: $t("dataset.title"),
        description: $t("dataset.description"),
        icon: "i-lucide-database",
        to: "/datasets",
      },
    ]);
  }
  if (authStore.canManageOrganization) {
    features = features.concat([
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
  }
  return features;
});
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('global.home') + ' TEST PR PREVIEW'"
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
