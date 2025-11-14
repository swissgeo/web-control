<script setup lang="ts">
const { setPageTitle } = useMeta();

const authStore = useAuthStore();

const usersName = computed(() => {
  return authStore.profile.given_name + " " + authStore.profile.family_name;
});

setPageTitle($t("welcome"));
onMounted(async () => {
  console.log(authStore.isLoggedIn);
});
</script>

<template>
  <UPageSection>
    <div>{{ $t("welcome") }} {{ usersName }}</div>
  </UPageSection>
</template>
