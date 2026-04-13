<script setup lang="ts">
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import { useUnitsApi, type Unit } from "~/api/units";
import { useUsersApi, type AccessRequest, type Role } from "~/api/users";
import * as v from "valibot";

definePageMeta({
  middleware: ["organization-admin"],
});

const UBadge = resolveComponent("UBadge");
const { toastError } = useToastHelpers();
const { setPageTitle } = useMeta();
const { formatDateTime } = useDateTimeFormat();

setPageTitle($t("accessRequest.pageTitle"));

const allRoles = ref<Role[]>([]);
const allUnits = ref<Unit[]>([]);
const accessRequests = ref<AccessRequest[]>([]);
const open = ref(false);
const selectedAccessRequest = ref<AccessRequest>();

const tableColumns = computed<TableColumn<AccessRequest>[]>(() => [
  {
    accessorKey: "user.first_name",
    header: $t("user.first_name"),
  },
  {
    accessorKey: "user.last_name",
    header: $t("user.last_name"),
  },
  {
    accessorKey: "user.email",
    header: $t("user.email"),
  },
  {
    accessorKey: "created",
    header: $t("accessRequest.created"),
    cell: ({ row }) => {
      return formatDateTime(row.original.created);
    },
  },
  {
    accessorKey: "state",
    header: $t("accessRequest.state"),
    cell: ({ row }) => {
      const state = row.original.state;
      const color = {
        PENDING: "warning" as const,
        APPROVED: "success" as const,
        DECLINED: "error" as const,
        CANCELLED: "neutral" as const,
      }[state as string];
      const stateText = {
        PENDING: $t("accessRequest.statePending"),
        APPROVED: $t("accessRequest.stateApproved"),
        DECLINED: $t("accessRequest.stateDeclined"),
        CANCELLED: $t("accessRequest.stateCancelled"),
      }[state as string];
      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => stateText,
      );
    },
  },
  {
    accessorKey: "actions",
    header: $t("common.actions"),
    meta: {
      class: {
        th: "text-right",
        td: "text-right",
      },
    },
  },
]);

const schema = v.object({
  unit: v.union([v.string(), v.null()]),
  roles: v.pipe(
    v.array(v.string()),
    v.nonEmpty(() => $t("validation.required")),
  ),
});

const formState = reactive({
  unit: null as string | null,
  roles: [] as string[],
});

onMounted(() => {
  loadAccessRequests();
  try {
    useUsersApi()
      .getRoles()
      .then((roles) => {
        allRoles.value = roles;
      });
    useUnitsApi()
      .getUnits()
      .then((units) => {
        allUnits.value = units;
      });
  } catch (err: unknown) {
    console.error("Failed to load roles or units", err);
    toastError($t("common.loadError"));
  }
});

async function loadAccessRequests() {
  try {
    accessRequests.value = await useUsersApi().getAccessRequests();
  } catch (err: unknown) {
    console.error("Failed to load access requests", err);
    accessRequests.value = [];
    toastError($t("common.loadError"));
  }
}

function openApproveModal(request: AccessRequest) {
  open.value = true;
  selectedAccessRequest.value = request;
}

async function approveAccessRequest(
  event: FormSubmitEvent<v.InferOutput<typeof schema>>,
) {
  try {
    await useUsersApi().updateAccessRequest(
      selectedAccessRequest.value!.id,
      "APPROVED",
      event.data.roles,
      event.data.unit,
    );
    loadAccessRequests();
    closeModal();
  } catch (err: unknown) {
    console.error("Failed to approve access request", err);
    toastError($t("accessRequest.requestFailed"));
  }
}

function closeModal() {
  open.value = false;
  formState.unit = null;
  formState.roles = [];
}

async function declineAccessRequest(request: AccessRequest) {
  try {
    await useUsersApi().updateAccessRequest(request.id, "DECLINED", null, null);
    loadAccessRequests();
  } catch (err: unknown) {
    console.error("Failed to decline access request", err);
    toastError($t("accessRequest.requestFailed"));
  }
}
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('accessRequest.pageTitle')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <p>{{ $t("accessRequest.description") }}</p>
        <UTable
          :columns="tableColumns"
          :data="accessRequests"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0',
          }"
        >
          <template #actions-cell="{ row }">
            <div v-if="row.original.state === 'PENDING'">
              <UButton
                class="mx-4"
                color="success"
                :label="$t('accessRequest.approve')"
                @click="openApproveModal(row.original)"
              />
              <UButton
                class="mx-4"
                color="error"
                :label="$t('accessRequest.decline')"
                @click="declineAccessRequest(row.original)"
              />
            </div>
          </template>
        </UTable>
      </UPageBody>

      <UModal
        v-model:open="open"
        :title="$t('accessRequest.approveModalTitle')"
        :description="$t('accessRequest.approveModalDescription')"
      >
        <template #body>
          <UForm
            :schema="schema"
            :state="formState"
            @submit="approveAccessRequest($event)"
          >
            <div class="flex shrink-0 flex-col flex-wrap gap-4 p-6">
              <UFormField :label="$t('unit.unit')" name="unit">
                <USelectMenu
                  v-model="formState.unit"
                  :search-input="false"
                  class="w-full"
                  :items="[
                    { label: $t('common.none'), value: null },
                    ...allUnits.map((unit) => ({
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
                    ...allRoles.map((role) => ({
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
                @click="closeModal()"
              />
              <UButton
                class="m-1"
                type="submit"
                color="success"
                :label="$t('accessRequest.approve')"
              />
            </div>
          </UForm>
        </template>
      </UModal>
    </UPage>
  </div>
</template>
