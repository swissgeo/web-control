<script setup lang="ts">
import useCognitoApi from "~/api/cognito";

const authStore = useAuthStore();

const { setPageTitle } = useMeta();

const cognitoApi = useCognitoApi();

setPageTitle("Login");

onMounted(() => {
  // authStore.$reset();
});

function goToLogin() {
  cognitoApi.goToLogin();
}
</script>

<template>
  <div>
    <UPageSection>
      <div>Welcome to the business portal. Please login</div>
      <UButton icon="i-lucide-external-link" @click="goToLogin">Login</UButton>
    </UPageSection>
  </div>
</template>
