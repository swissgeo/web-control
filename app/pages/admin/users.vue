<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useUnitsApi, type Unit } from "~/api/units";
import { useUsersApi, type Role, type User } from "~/api/users";
import DetailUserForm, {
  type UserSchema,
} from "~/components/user/detailUserForm.vue";

definePageMeta({
  middleware: ["organization-admin"],
});

const { toastError, toastSuccess } = useToastHelpers();
const { setPageTitle } = useMeta();

setPageTitle($t("user.title"));

const allRoles = ref<Role[]>([]);
const allUnits = ref<Unit[]>([]);
const users = ref<User[]>([]);
const displayDetailModal = ref(false);
const selectedUser = ref<User>();

const tableColumns = computed<TableColumn<User>[]>(() => [
  {
    accessorKey: "first_name",
    header: $t("user.first_name"),
  },
  {
    accessorKey: "last_name",
    header: $t("user.last_name"),
  },
  {
    accessorKey: "email",
    header: $t("user.email"),
  },
  {
    accessorKey: "unit.name",
    header: $t("unit.unit"),
    cell: ({ row }) => {
      return row.original.unit ? row.original.unit.name : "-";
    },
  },
  {
    accessorKey: "roles",
    header: $t("user.roles"),
    cell: ({ row }) => {
      const names = (row.original.roles ?? []).map((r) => r.name);
      return names.length ? names.join(", ") : "-";
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

onMounted(() => {
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
  loadUsers();
});

async function loadUsers() {
  try {
    users.value = await useUsersApi().getUsers();
  } catch (err: unknown) {
    console.error("Failed to load users", err);
    toastError($t("common.loadError"));
  }
}

const onEdit = (row: User): void => {
  selectedUser.value = row;
  displayDetailModal.value = true;
};

function closeUserDetails() {
  displayDetailModal.value = false;
}

async function saveUser(data: UserSchema) {
  try {
    await useUsersApi().updateUser({
      id: selectedUser.value!.id,
      unit_id: data.unit ? data.unit : null,
      role_ids: data.roles,
    });
    toastSuccess($t("user.updateSuccess"));
    loadUsers();
    closeUserDetails();
  } catch (err: unknown) {
    console.error("Failed to update user", err);
    toastError($t("user.errorUpdate"));
  }
}
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('user.title')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <p>{{ $t("user.description") }}</p>

        <Transition
          enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          enter-from-class="max-h-0"
          enter-to-class="max-h-[500px] opacity-100"
          leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          leave-from-class="max-h-[500px] opacity-100"
          leave-to-class="max-h-0"
        >
          <UPageSection
            v-if="displayDetailModal && selectedUser"
            class="overflow-hidden"
            :ui="{ container: 'py-4! gap-4!', description: 'mt-2' }"
          >
            <DetailUserForm
              :user="selectedUser"
              :available-roles="allRoles"
              :available-units="allUnits"
              @submit="saveUser($event)"
              @cancel="closeUserDetails()"
            />
          </UPageSection>
        </Transition>

        <UTable
          :columns="tableColumns"
          :data="users"
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
            <div>
              <UButton color="neutral" @click="onEdit(row.original)"
                >{{ $t("common.edit") }}
              </UButton>
            </div>
          </template>
        </UTable>
      </UPageBody>
    </UPage>
  </div>
</template>
