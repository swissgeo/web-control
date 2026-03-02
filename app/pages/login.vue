<script setup lang="ts">
const { setPageTitle } = useMeta();

const authStore = useAuthStore();

setPageTitle("Login");

function goToLogin() {
  authStore.login();
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
    <UPageBody class="flex flex-col items-center">
      <UPageSection
        :ui="{ container: 'py-4!' }"
        :title="$t('Login')"
        description="Welcome to the business portal. Please login"
        class="flex w-max flex-col items-center text-center"
      >
        <div>
          <UButton
            icon="i-lucide-external-link"
            class="max-w-max p-3 ps-5 pe-5"
            @click="goToLogin"
            >Login</UButton
          >
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
  <!-- <div>
    <UPageSection>
      <div>Welcome to the business portal. Please login</div>
    </UPageSection>
  </div> -->
</template>
