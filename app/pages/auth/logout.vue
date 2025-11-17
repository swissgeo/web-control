<script lang="ts" setup>
import useCognitoApi from "~/api/cognito";

definePageMeta({
  name: "auth-logout",
});

const router = useRouter();
const cognito = useCognitoApi();

onMounted(async () => {
  try {
    await cognito.logout();
  } catch {
    console.error("Logout failed");
    cognito.removeUser();
  } finally {
    router.push("/login");
  }
});
</script>

<template><UPageSection>Logging out ..</UPageSection></template>
