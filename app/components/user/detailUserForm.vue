<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import type { Unit } from "~/api/units";
import type { Role, User } from "~/api/users";

const props = defineProps<{
  user: User;
  availableRoles: Role[];
  availableUnits: Unit[];
}>();

const emit = defineEmits<{
  (e: "submit", payload: UserSchema): void;
  (e: "cancel"): void;
}>();

export type UserSchema = v.InferOutput<typeof schema>;
const schema = v.object({
  first_name: v.string(),
  last_name: v.string(),
  email: v.string(),
  unit: v.union([v.string(), v.null()]),
  roles: v.array(v.string()),
});

const formState = reactive({
  first_name: "",
  last_name: "",
  email: "",
  unit: undefined as string | undefined,
  roles: [] as string[],
});

function syncFormFromUser(user: User) {
  formState.first_name = user.first_name;
  formState.last_name = user.last_name;
  formState.email = user.email;
  formState.unit = user.unit?.id ?? undefined;
  formState.roles = user.roles?.map((role) => role.id) ?? [];
}

watch(
  () => props.user,
  (user) => {
    syncFormFromUser(user);
  },
  { immediate: true },
);

function handleSubmit(event: FormSubmitEvent<UserSchema>) {
  emit("submit", event.data);
}
</script>

<template>
  <UForm :schema="schema" :state="formState" @submit="handleSubmit($event)">
    <div class="flex shrink-0 flex-col p-6">
      <UFormField :label="$t('user.first_name')" name="first_name">
        <UInput v-model="formState.first_name" :readonly="true" />
      </UFormField>
      <UFormField :label="$t('user.last_name')" name="last_name">
        <UInput v-model="formState.last_name" :readonly="true" />
      </UFormField>
      <UFormField :label="$t('user.email')" name="email">
        <UInput v-model="formState.email" :readonly="true" />
      </UFormField>
      <UFormField :label="$t('unit.unit')" name="unit">
        <USelectMenu
          v-model="formState.unit"
          :search-input="false"
          class="w-full"
          :items="[
            { label: $t('common.none'), value: null },
            ...props.availableUnits.map((unit) => ({
              label: unit.name,
              value: unit.id,
            })),
          ]"
          value-key="value"
        />
      </UFormField>
      <UFormField :label="$t('user.roles')" name="roles">
        <USelectMenu
          :model-value="formState.roles"
          :search-input="false"
          class="w-full"
          :items="[
            { label: $t('common.none'), value: '__none__' },
            ...props.availableRoles.map((role) => ({
              label: role.name,
              value: role.id,
            })),
          ]"
          value-key="value"
          multiple
          @update:model-value="
            (val: string[]) =>
              (formState.roles = val.includes('__none__') ? [] : val)
          "
        />
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
