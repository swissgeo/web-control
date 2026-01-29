<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();
const UButton = resolveComponent("UButton");

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
    username: "Human 1",
    orgUnit: "Unit 1",
    role: "Organization Admin",
  },
  {
    id: 2,
    username: "Human 2",
    orgUnit: "Unit 1",
    role: "Dataset Admin",
  },
]);

const tableColumns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
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
        <p>View and edit the users of your organization</p>
        <UAlert
          title="Heads up!"
          description="This is a placeholder page with dummy data"
        />
        <UTable :columns="tableColumns" :data="users">
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

<style>
/*
According to https://github.com/nuxt/ui/issues/2332
Set the default cursor for buttons.
*/
button,
[role="button"] {
  cursor: pointer;
}
:disabled {
  cursor: default;
}
</style>
