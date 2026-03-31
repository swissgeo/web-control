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
      toastError($t("machineUser.errorClipboard"));
      return;
    }
    await navigator.clipboard.writeText(props.machineDetails.client_secret);
    toastSuccess($t("machineUser.successClipboard"));
  } catch (err: unknown) {
    console.error("Failed to copy to clipboard", err);
    toastError($t("machineUser.errorClipboard"));
  }
}
</script>

<template>
  <UAlert color="error" :description="$t('machineUser.copyToken')" />
  <div class="flex shrink-0 flex-col p-6">
    <UFormField :label="$t('machineUser.clientId')">
      <UInput :value="machineDetails.client_id" disabled class="w-110" />
    </UFormField>
    <UFormField :label="$t('machineUser.clientSecret')">
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
    <UButton
      class="m-1"
      :label="$t('common.close')"
      color="primary"
      @click="emit('close')"
    />
  </div>
</template>
