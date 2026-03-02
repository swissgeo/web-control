<script setup lang="ts">
import type { MachineUser } from "~/api/machineUsers";

const { toastError, toastSuccess } = useToastHelpers();

const props = defineProps<{
  machineDetails: MachineUser;
}>();
const emit = defineEmits(["close"]);

async function copyToClipboard() {
  try {
    if (props.machineDetails.client_secret === undefined) {
      toastError("Failed to copy to clipboard");
      return;
    }
    await navigator.clipboard.writeText(props.machineDetails.client_secret);
    toastSuccess("Copied to clipboard");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError("Failed to copy to clipboard");
  }
}
</script>

<template>
  <UAlert
    color="error"
    description="Copy the secret to a secure location (e.g. password manager). After closing this dialog you will not be able to see the secret again."
  />
  <div class="flex shrink-0 flex-col p-6">
    <UFormField label="ID">
      <UInput :value="machineDetails.client_id" disabled class="w-110" />
    </UFormField>
    <UFormField label="Secret">
      <UFieldGroup>
        <UInput :value="machineDetails.client_secret" disabled class="w-110" />

        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide-clipboard"
          @click="copyToClipboard"
        />
      </UFieldGroup>
    </UFormField>
  </div>
  <div class="flex shrink-0 justify-end p-6">
    <UButton class="m-1" label="Close" color="primary" @click="emit('close')" />
  </div>
</template>
