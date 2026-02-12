<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();

setPageTitle("Units");

interface OrgUnit {
  id: number;
  name: string;
  user_count: number;
  dataset_count: number;
}

const units = ref<OrgUnit[]>([
  {
    id: 1,
    name: "Vermessung",
    user_count: 7,
    dataset_count: 15,
  },
  {
    id: 2,
    name: "KOGIS",
    user_count: 3,
    dataset_count: 8,
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
    accessorKey: "user_count",
    header: "Users",
  },
  {
    accessorKey: "dataset_count",
    header: "Datasets",
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

const onEdit = (row: OrgUnit): void => {
  toastInfo("No yet implemented.");
  console.log("Edit Org Unit:", row);
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
        <UAlert
          color="warning"
          title="Heads up!"
          description="This is a placeholder page with dummy data"
        />
        <p>View and edit the organizational units.</p>
        <UTable
          :columns="tableColumns"
          :data="units"
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
