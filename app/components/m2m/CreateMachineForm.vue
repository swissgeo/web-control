<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

const props = defineProps<{
  existingMachineUsers: MachineUser[] | undefined;
}>();

const emit = defineEmits<{
  (e: "submit", payload: FormSubmitEvent<CreateMachineUserSchema>): void;
  (e: "cancel"): void;
}>();

export type CreateMachineUserSchema = v.InferOutput<typeof schema>;
const schema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty("Name is required"),
    v.minLength(3, "Must be at least 3 characters"),
    v.maxLength(50, "Must not be more than 50 characters"),
    v.check(
      (item) =>
        props.existingMachineUsers?.find((m) => m.name === item) === undefined,
      "Machine user with this name already exists",
    ),
  ),
  tokenDuration: v.pipe(
    v.number(),
    v.minValue(1, "Must be at least 1 minute"),
    v.maxValue(60, "Maximum 1 hour"),
  ),
});

const formState = reactive({
  name: "",
  tokenDuration: 15,
});
</script>

<template>
  <UForm :schema="schema" :state="formState" @submit="emit('submit', $event)">
    <UFormField label="Name" name="name">
      <UInput v-model="formState.name" />
    </UFormField>
    <UFormField label="Token Duration in Minutes" name="tokenDuration">
      <UInput v-model="formState.tokenDuration" type="number" />
    </UFormField>
    <div class="flex shrink-0 p-6 justify-end">
      <UButton
        class="m-1"
        label="Cancel"
        color="neutral"
        @click="emit('cancel')"
      />
      <UButton class="m-1" type="submit" label="Submit" color="primary" />
    </div>
  </UForm>
</template>
