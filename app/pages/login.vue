<script setup lang="ts">
const { setPageTitle } = useMeta();

const authStore = useAuthStore();
const environment = useRuntimeConfig().public.environment;

setPageTitle($t("login.title"));

function goToLogin() {
  authStore.login({ useCognitoOnly: false });
}
function goToLoginWithCognito() {
  authStore.login({ useCognitoOnly: true });
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('global.home')"
      :ui="{
        root: 'p-2',
      }"
    />
    <UPageBody class="flex flex-col items-center">
      <UPageSection
        :ui="{ container: 'py-4!' }"
        :title="$t('login.title')"
        :description="$t('login.description')"
        class="flex w-max flex-col items-center text-center"
      >
        <div>
          <UButton
            icon="i-lucide-external-link"
            class="max-w-max p-3 ps-5 pe-5"
            @click="goToLogin"
            >{{ $t("login.login") }}</UButton
          >
          <div v-if="environment !== 'prod'" class="m-4">
            <UButton
              icon="i-lucide-external-link"
              class="max-w-max p-3 ps-5 pe-5"
              @click="goToLoginWithCognito"
              >{{ $t("login.loginWithCognito") }}</UButton
            >
          </div>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
