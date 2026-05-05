<script setup lang="ts">
import SuperuserProfile from "~/components/SuperuserProfile.vue";

const authStore = useAuthStore();

const { setPageTitle } = useMeta();

setPageTitle($t("profile.title"));

const profile = computed(() => {
  return authStore.profile;
});
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('profile.title')"
      :ui="{
        root: 'p-2',
      }"
    />
    <UPageBody>
      <UPageSection :ui="{ container: 'py-4! gap-4!' }">
        <UPageCard
          icon="i-lucide-user"
          :title="profile?.lastName + ' ' + profile?.firstName || 'Profile'"
          :description="profile?.email"
        >
          <!-- TODO: Find if this is correct link and put in config -->
          <a href="https://myaccount-r.eiam.admin.ch"
            ><UButton icon="i-lucide-external-link">{{
              $t("profile.eIamProfile")
            }}</UButton></a
          >
        </UPageCard>
        <SuperuserProfile v-if="profile?.isSuperUser" />
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
