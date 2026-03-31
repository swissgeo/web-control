<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import { useOrganizationApi, type Organization } from "~/api/organization";
import { useUnitsApi, type Unit } from "~/api/units";
import { useUsersApi, type Role } from "~/api/users";

const authStore = useAuthStore();
const { toastError, toastSuccess } = useToastHelpers();

const availableOrganizations = ref<Organization[]>([]);
const availableUnits = ref<Unit[]>([]);
const availableRoles = ref<Role[]>([]);

const { setPageTitle } = useMeta();

setPageTitle($t("profile.title"));

const profile = computed(() => {
  return authStore.profile;
});

export type AdminSchema = v.InferOutput<typeof schema>;
const schema = v.object({
  organization: v.union([v.string(), v.null()]),
  unit: v.union([v.string(), v.null()]),
  roles: v.array(v.string()),
});

const formState = reactive({
  organization: null as string | null,
  unit: null as string | null,
  roles: [] as string[],
});
const pendingUnitId = ref<string | null>(null);

const organizationItems = computed(() => [
  { label: $t("common.none"), value: null as null | string },
  ...availableOrganizations.value.map((org) => ({
    label: org.name,
    value: org.id,
  })),
]);

const unitItems = computed(() => [
  { label: $t("common.none"), value: null as null | string },
  ...availableUnits.value.map((unit) => ({
    label: unit.name,
    value: unit.id,
  })),
]);

const roleItems = computed(() => [
  { label: $t("common.none"), value: "__none__" },
  ...availableRoles.value.map((role) => ({
    label: role.name,
    value: role.id,
  })),
]);

onMounted(async () => {
  if (!profile.value.isSuperUser) return;

  try {
    availableOrganizations.value =
      await useOrganizationApi().getOrganizations();
    availableRoles.value = await useUsersApi().getRoles();

    formState.roles = [...(profile.value.roles ?? [])];
    formState.organization = profile.value.organizationId ?? null;
    pendingUnitId.value = profile.value.unitId ?? null;
  } catch (err: unknown) {
    console.error("Failed to load organizations or roles", err);
    toastError($t("common.loadError"));
  }
});

watch(
  () => formState.organization,
  async (organizationId) => {
    availableUnits.value = [];
    formState.unit = null;

    if (!organizationId) return;

    try {
      availableUnits.value =
        await useUnitsApi().getUnitsByOrganization(organizationId);

      if (pendingUnitId.value) {
        const hasPendingUnit = availableUnits.value.some(
          (unit) => unit.id === pendingUnitId.value,
        );
        formState.unit = hasPendingUnit ? pendingUnitId.value : null;
        pendingUnitId.value = null;
      }
    } catch (err: unknown) {
      console.error("Failed to load units for organization", err);
      toastError($t("common.loadError"));
    }
  },
);

function handleSubmit(event: FormSubmitEvent<AdminSchema>) {
  authStore.setProfileForSuperUser(
    event.data.organization as string | undefined,
    event.data.unit as string | undefined,
    event.data.roles,
  );
  toastSuccess($t("profile.updateSuccess"));
}
</script>

<template>
  <UPageCard
    v-if="profile?.isSuperUser"
    :title="$t('profile.superUserTitle')"
    :description="$t('profile.superUserDescription')"
  >
    <!-- Set organization, unit and roles for superuser -->
    <UForm :schema="schema" :state="formState" @submit="handleSubmit($event)">
      <div class="flex shrink-0 flex-col p-6">
        <UFormField :label="$t('organization.title')" name="organization">
          <USelectMenu
            v-model="formState.organization"
            :search-input="false"
            class="w-full"
            :items="organizationItems"
            value-key="value"
          />
        </UFormField>
        <UFormField :label="$t('unit.unit')" name="unit">
          <USelectMenu
            v-model="formState.unit"
            :search-input="false"
            class="w-full"
            :items="unitItems"
            value-key="value"
          />
        </UFormField>
        <UFormField :label="$t('user.roles')" name="roles">
          <USelectMenu
            :model-value="formState.roles"
            :search-input="false"
            class="w-full"
            :items="roleItems"
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
        <!-- <UButton
                class="m-1"
                :label="$t('common.cancel')"
                color="secondary"
                @click="emit('cancel')"
              /> -->
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
