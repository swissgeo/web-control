<script lang="ts" setup>
definePageMeta({
  name: "auth-logout",
});

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authStore.logout();
  } catch {
    console.error("Logout failed");
    authStore.$reset();
  } finally {
    router.push("/login");
  }
});
</script>

<template>
  <UPageSection>{{ $t("logout.description") }}</UPageSection>
</template>
