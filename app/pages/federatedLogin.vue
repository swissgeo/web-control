<script lang="ts" setup>
import useCognitoApi from "~/api/cognito";

definePageMeta({
  // this name is being used to identify this route, so better not change it
  // or change it everywhere
  name: "auth-callback",
});

const authStore = useAuthStore();
const cognitoApi = useCognitoApi();
const router = useRouter();

const isThereAProblem = ref(false);

onMounted(() => {
  getAccessTokens();
});

async function getAccessTokens() {
  try {
    await cognitoApi.exchangeCodeForAccessTokens();
    router.push(authStore.loginUrl || "/");
  } catch (err: unknown) {
    console.error(err);
    isThereAProblem.value = true;
  }
}
</script>

<template>
  <UPageSection>Exchanging code for tokens...</UPageSection>
</template>
