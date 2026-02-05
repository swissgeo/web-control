<script setup lang="ts">
const { setPageTitle } = useMeta();

const authStore = useAuthStore();

const usersName = computed(() => {
  return authStore.profile.given_name + " " + authStore.profile.family_name;
});

setPageTitle($t("welcome"));
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
      <UPageSection>
        <div>{{ $t("welcome") }} {{ usersName }}</div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
