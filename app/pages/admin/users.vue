<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();

setPageTitle("Users");

interface User {
  id: number;
  username: string;
  orgUnit: string;
  role: string;
}

const users = ref<User[]>([
  {
    id: 1,
    username: "Elisabeth Valenzuela",
    orgUnit: "-",
    role: "Organization Admin",
  },
  {
    id: 1,
    username: "Jamari Freeman",
    orgUnit: "KOGIS",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Norah Anthony",
    orgUnit: "KOGIS",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Shiloh Herman",
    orgUnit: "KOGIS",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Imani McCoy",
    orgUnit: "KOGIS",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Jett Wyatt",
    orgUnit: "KOGIS",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Liberty Herman",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Juelz Chambers",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Makayla Kaur",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Augustine Wyatt",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Liberty Hayes",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Legend Long",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Jade Powell",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
  {
    id: 1,
    username: "Bennett Jarvis",
    orgUnit: "Vermessung",
    role: "Dataset Admin",
  },
]);

const tableColumns: TableColumn<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "orgUnit",
    header: "Unit",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    meta: {
      class: {
        th: "text-right",
        td: "text-right",
      },
    },
  },
];

const onEdit = (row: User): void => {
  toastInfo("No yet implemented.");
  console.log("Edit User:", row);
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('Users')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <UAlert
          color="warning"
          title="Heads up!"
          description="This is a placeholder page with dummy data"
        />
        <p>View and edit the users of your organization</p>
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
              <UButton color="neutral" @click="onEdit(row.original)">
                Edit
              </UButton>
            </div>
          </template>
        </UTable>
      </UPageBody>
    </UPage>
  </div>
</template>
