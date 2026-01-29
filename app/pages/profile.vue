<script setup lang="ts">
const authStore = useAuthStore();

const { setPageTitle } = useMeta();

setPageTitle("Profile");

const profile = computed(() => {
  return authStore.profile;
});

const accessData = computed(() => {
  if (authStore.accessData) {
    return Object.fromEntries(
      Object.entries(authStore.accessData).filter(
        ([key, _]) => key !== "profile",
      ),
    );
  } else {
    return "";
  }
});
</script>

<template>
  <div>
    <UPageSection :title="$t('profile')">
      <pre class="bg-amber-50">
        {{ profile }}
      </pre>
    </UPageSection>

    <UPageSection title="accessData">
      <pre class="bg-amber-50">
        {{ accessData }}
      </pre>
    </UPageSection>
  </div>
</template>
