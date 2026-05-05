<script setup lang="ts">
import type { MachineUser } from "~/api/machineUsers";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

const props = defineProps<{
  existingMachineUsers?: MachineUser[];
}>();

const emit = defineEmits<{
  (e: "submit", payload: FormSubmitEvent<CreateMachineUserSchema>): void;
  (e: "cancel"): void;
}>();

export type CreateMachineUserSchema = v.InferOutput<typeof schema>;
const schema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty(() => $t("validation.required")),
    v.minLength(3, () => $t("validation.minLength", { length: 3 })),
    v.maxLength(50, () => $t("validation.maxLength", { length: 50 })),
    v.check(
      (item) =>
        props.existingMachineUsers?.find((m) => m.name === item) === undefined,
      () => $t("machineUser.errorUserAlreadyExists"),
    ),
  ),
  tokenDuration: v.pipe(
    v.number(),
    v.minValue(1, () => $t("validation.minValue", { value: 1 })),
    v.maxValue(60, () => $t("validation.maxValue", { value: 60 })),
  ),
});

const formState = reactive({
  name: "",
  tokenDuration: 15,
});
</script>

<template>
  <UAlert color="info" :description="$t('machineUser.createDescription')" />
  <UForm :schema="schema" :state="formState" @submit="emit('submit', $event)">
    <div class="flex shrink-0 flex-col p-6">
      <UFormField :label="$t('common.name')" name="name">
        <UInput v-model="formState.name" />
      </UFormField>
      <UFormField :label="$t('machineUser.tokenDuration')" name="tokenDuration">
        <UInput v-model="formState.tokenDuration" type="number" />
      </UFormField>
    </div>
    <div class="flex shrink-0 justify-end p-6">
      <UButton
        class="m-1"
        :label="$t('common.cancel')"
        color="secondary"
        @click="emit('cancel')"
      />
      <UButton
        class="m-1"
        type="submit"
        :label="$t('common.submit')"
        color="primary"
      />
    </div>
  </UForm>
</template>
