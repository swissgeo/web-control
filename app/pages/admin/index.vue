<script setup lang="ts">
const { setPageTitle } = useMeta();

setPageTitle("Organization");
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('Organization')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <p>View and edit your organization.</p>
        <UAlert
          title="Heads up!"
          description="This is a placeholder page with dummy data"
        />
        Details on your organization
      </UPageBody>
    </UPage>
  </div>
</template>
