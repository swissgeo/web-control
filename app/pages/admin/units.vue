<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();
const { toastInfo } = useToastHelpers();

setPageTitle($t("unit.title"));

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

const tableColumns = computed<TableColumn<OrgUnit>[]>(() => [
  {
    accessorKey: "id",
    header: $t("common.id"),
  },
  {
    accessorKey: "name",
    header: $t("common.name"),
  },
  {
    accessorKey: "user_count",
    header: $t("unit.userCount"),
  },
  {
    accessorKey: "dataset_count",
    header: $t("unit.datasetCount"),
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

const onEdit = (row: OrgUnit): void => {
  toastInfo($t("common.notImplementedYet"));
  console.log("Edit Org Unit:", row);
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('unit.title')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <DummyDataBanner />
        <p>{{ $t("unit.description") }}</p>
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
