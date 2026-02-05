<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();

setPageTitle("Units");

interface OrgUnit {
  id: number;
  name: string;
}

const units = ref<OrgUnit[]>([
  {
    id: 1,
    name: "Unit 1",
  },
  {
    id: 2,
    name: "Unit 2",
  },
]);

const tableColumns: TableColumn<OrgUnit>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
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

const onDelete = (row: OrgUnit): void => {
  console.log("Delete Org Unit:", row);
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('Units')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <p>View and edit the organizational units.</p>
        <UAlert
          title="Heads up!"
          description="This is a placeholder page with dummy data"
        />
        <UTable :columns="tableColumns" :data="units">
          <template #actions-cell="{ row }">
            <div>
              <UButton color="neutral" @click="onDelete(row.original)">
                Delete
              </UButton>
            </div>
          </template>
        </UTable>
      </UPageBody>
    </UPage>
  </div>
</template>
