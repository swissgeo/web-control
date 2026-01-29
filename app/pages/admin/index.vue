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

<style>
/*
According to https://github.com/nuxt/ui/issues/2332
Set the default cursor for buttons.
*/
button,
[role="button"] {
  cursor: pointer;
}
:disabled {
  cursor: default;
}
</style>
