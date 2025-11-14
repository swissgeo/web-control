<script lang="ts" setup>
import useCognitoApi from "~/api/cognito";

definePageMeta({
  name: "auth-logout",
});

const router = useRouter();
const cognito = useCognitoApi();

onMounted(async () => {
  await cognito.logout();

  router.push("/login");
});
</script>

<template><UPageSection>Logging out ..</UPageSection></template>
