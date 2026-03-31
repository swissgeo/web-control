<script setup lang="ts">
import type { Unit } from "~/api/units";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

const props = defineProps<{
  existingUnit?: Unit;
}>();

const emit = defineEmits<{
  (e: "submit", payload: Unit): void;
  (e: "cancel"): void;
}>();

const requiredStringValidation = v.pipe(
  v.string(),
  v.nonEmpty(() => $t(`validation.required`)),
  v.minLength(3, () => $t(`validation.minLength`, { length: 3 })),
  v.maxLength(50, () => $t(`validation.maxLength`, { length: 50 })),
);
const optionalStringValidation = v.union([
  v.literal(""),
  v.pipe(
    v.string(),
    v.minLength(3, () => $t(`validation.minLength`, { length: 3 })),
    v.maxLength(50, () => $t(`validation.maxLength`, { length: 50 })),
  ),
]);

export type CreateUnitSchema = v.InferOutput<typeof schema>;
const schema = v.object({
  id: requiredStringValidation,
  name_de: requiredStringValidation,
  name_fr: requiredStringValidation,
  name_en: requiredStringValidation,
  name_it: optionalStringValidation,
  name_rm: optionalStringValidation,
});

const formState = reactive({
  id: "",
  name_de: "",
  name_fr: "",
  name_en: "",
  name_it: "",
  name_rm: "",
});

function syncFormFromUnit(unit?: Unit) {
  formState.id = unit?.id ?? "";
  formState.name_de = unit?.name_translations.de ?? "";
  formState.name_fr = unit?.name_translations.fr ?? "";
  formState.name_en = unit?.name_translations.en ?? "";
  formState.name_it = unit?.name_translations.it ?? "";
  formState.name_rm = unit?.name_translations.rm ?? "";
}

watch(
  () => props.existingUnit,
  (unit) => {
    syncFormFromUnit(unit);
  },
  { immediate: true },
);

function handleSubmit(event: FormSubmitEvent<CreateUnitSchema>) {
  const { id, name_de, name_fr, name_en, name_it, name_rm } = event.data;
  emit("submit", {
    id,
    name: name_en, // Not relevant for create/update
    name_translations: {
      de: name_de,
      fr: name_fr,
      en: name_en,
      ...(name_it ? { it: name_it } : {}),
      ...(name_rm ? { rm: name_rm } : {}),
    },
    organization_id: "", // Will be set by parent component
  });
}
</script>

<template>
  <UPageCard
    :title="
      props.existingUnit
        ? $t('unit.editTitle', { name: props.existingUnit.name })
        : $t('unit.createTitle')
    "
  >
    <UForm :schema="schema" :state="formState" @submit="handleSubmit($event)">
      <div class="wp-100 flex shrink-0 flex-wrap gap-4 p-6">
        <UFormField :label="$t('common.id')" name="id">
          <UInput
            v-model="formState.id"
            :readonly="Boolean(props.existingUnit)"
          />
        </UFormField>
        <USeparator :label="$t('common.translations')" class="wp-100" />
        <UFormField :label="$t('common.name_de')" name="name_de">
          <UInput v-model="formState.name_de" />
        </UFormField>
        <UFormField :label="$t('common.name_fr')" name="name_fr">
          <UInput v-model="formState.name_fr" />
        </UFormField>
        <UFormField :label="$t('common.name_en')" name="name_en">
          <UInput v-model="formState.name_en" />
        </UFormField>
        <UFormField :label="$t('common.name_it')" name="name_it">
          <UInput v-model="formState.name_it" />
        </UFormField>
        <UFormField :label="$t('common.name_rm')" name="name_rm">
          <UInput v-model="formState.name_rm" />
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
