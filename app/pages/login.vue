<script setup lang="ts">
import useCognitoApi from "~/api/cognito";

const authStore = useAuthStore();
const router = useRouter();

const { setPageTitle } = useMeta();

const cognitoApi = useCognitoApi();

setPageTitle("Login");

onMounted(() => {
  if (authStore.isLoggedIn) {
    // we're logged in, no need to stay here!
    router.push("/");
  }
});

function goToLogin() {
  cognitoApi.goToLogin();
}
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
        :ui="{ container: 'py-4!' }"
        :title="$t('Login')"
        description="Welcome to the business portal. Please login"
      >
        <UButton icon="i-lucide-external-link" @click="goToLogin"
          >Login</UButton
        >
      </UPageSection>
    </UPageBody>
  </UPage>
  <!-- <div>
    <UPageSection>
      <div>Welcome to the business portal. Please login</div>
    </UPageSection>
  </div> -->
</template>
