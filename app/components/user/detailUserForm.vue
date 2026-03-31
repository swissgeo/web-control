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
  unit: v.union([v.string(), v.null()]),
  roles: v.array(v.string()),
});

const formState = reactive({
  unit: null as string | null,
  roles: [] as string[],
});

function syncFormFromUser(user: User) {
  formState.unit = user.unit?.id ?? null;
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
  <UPageCard
    :title="props.user.last_name + ' ' + props.user.first_name"
    :description="props.user.email"
  >
    <UForm :schema="schema" :state="formState" @submit="handleSubmit($event)">
      <div class="flex shrink-0 flex-col flex-wrap gap-4 p-6">
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
  </UPageCard>
</template>
