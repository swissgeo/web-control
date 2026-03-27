<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useUsersApi, type User } from "~/api/users";

const { toastError, toastSuccess } = useToastHelpers();
const { setPageTitle } = useMeta();
const { toastInfo } = useToastHelpers();

setPageTitle($t("user.title"));

const users = ref<User[]>([]);
const loadingUsers = ref(false);

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
  loadUsers();
});

async function loadUsers() {
  try {
    loadingUsers.value = true;
    users.value = await useUsersApi().getUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError($t("common.loadError"));
  } finally {
    loadingUsers.value = false;
  }
}

const onEdit = (row: User): void => {
  toastInfo($t("common.notImplementedYet"));
  console.log("Edit User:", row);
};
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
