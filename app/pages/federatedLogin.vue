<script lang="ts" setup>
// IMPORTANT: Do not rename this file, as the name is being used to identify this route, and
// is registered in the cognito client and in eIAM as the post login redirect url !

definePageMeta({
  // this name is being used to identify this route, so better not change it
  // or change it everywhere
  name: "auth-login-callback",
});

const authStore = useAuthStore();
const router = useRouter();

const isThereAProblem = ref(false);

onMounted(() => {
  getAccessTokens();
});

async function getAccessTokens() {
  try {
    await authStore.signinCallback();
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
