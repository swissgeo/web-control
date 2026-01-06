<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();
const UButton = resolveComponent("UButton");

setPageTitle("M2M");

interface User {
  id: number;
  username: string;
}

const users = ref<User[]>([
  {
    id: 1,
    username: "Machine 1",
  },
  {
    id: 1,
    username: "Machine 2",
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

const onResetPassword = (row: User): void => {
  console.log("Reset Password:", row.username);
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader :title="$t('Machine users')" />
      <UPageBody>
        <UTable :columns="tableColumns" :data="users">
          <template #actions-cell="{ row }">
            <div>
              <UButton color="neutral" @click="onResetPassword(row.original)">
                Reset Password
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
