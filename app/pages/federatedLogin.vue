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
  <UPageSection>
    <div class="fixed inset-0 flex items-center justify-center">
      <UIcon name="svg-spinners:6-dots-scale" mode="svg" size="100" />
    </div>
  </UPageSection>
</template>
