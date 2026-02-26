<script setup lang="ts">
const authStore = useAuthStore();

const { setPageTitle } = useMeta();

setPageTitle($t("profile.title"));

const profile = computed(() => {
  return authStore.profile;
});

// const accessData = computed(() => {
//   if (authStore.accessData) {
//     return Object.fromEntries(
//       Object.entries(authStore.accessData).filter(
//         ([key, _]) => key !== "profile",
//       ),
//     );
//   } else {
//     return "";
//   }
// });
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
          :title="profile?.family_name + ' ' + profile?.given_name || 'Profile'"
          :description="profile?.email"
        >
          <!-- TODO: Find if this is correct link and put in config -->
          <a href="https://myaccount-r.eiam.admin.ch"
            ><UButton icon="i-lucide-external-link">{{
              $t("profile.eIamProfile")
            }}</UButton></a
          >
        </UPageCard>
      </UPageSection>

      <!-- <UPageSection :ui="{ container: 'py-4! gap-4!' }">
        <pre class="bg-amber-50">
            {{ profile }}
          </pre
        >
      </UPageSection>
      <UPageSection title="accessData" :ui="{ container: 'py-4! gap-4!' }">
        <pre class="bg-amber-50">
          {{ accessData }}
        </pre>
      </UPageSection> -->
    </UPageBody>
  </UPage>
</template>
