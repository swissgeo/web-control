<script setup lang="ts">
defineProps<{
  machineDetails: MachineUser;
}>();
const emit = defineEmits(["close"]);
</script>

<template>
  <UAlert
    color="error"
    description="Copy the secret to a secure location (e.g. password manager). After closing this dialog you will not be able to see the secret again."
  />
  <div class="flex flex-col shrink-0 p-6">
    <UFormField label="ID">
      <UInput :value="machineDetails.client_id" disabled />
    </UFormField>
    <UFormField label="Secret">
      <UInput :value="machineDetails.client_secret" disabled />
    </UFormField>
  </div>
  <UButton class="m-1" label="Done" color="primary" @click="emit('close')" />
</template>
