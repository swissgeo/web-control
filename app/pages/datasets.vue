<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { setPageTitle } = useMeta();
const { toastInfo } = useToastHelpers();

setPageTitle($t("dataset.title"));

interface Datasets {
  id: string;
  name: string;
  orgUnit: string;
}

const units = ref<Datasets[]>([
  {
    id: "ch.swisstopo.amtliches-gebaeudeadressverzeichnis",
    name: "Official directory of building addresses",
    orgUnit: "Vermessung",
  },
  {
    id: "ch.swisstopo.amtliches-strassenverzeichnis",
    name: "Official directory of streets",
    orgUnit: "Vermessung",
  },
]);

const tableColumns = computed<TableColumn<Datasets>[]>(() => [
  {
    accessorKey: "id",
    header: $t("common.id"),
  },
  {
    accessorKey: "name",
    header: $t("common.name"),
  },
  {
    accessorKey: "orgUnit",
    header: $t("unit.unit"),
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

const onEdit = (row: Datasets): void => {
  toastInfo($t("common.notImplementedYet"));
  console.log("Edit Org Unit:", row);
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('dataset.title')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <DummyDataBanner />
        <p>{{ $t("dataset.description") }}</p>
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
              <UButton color="neutral" @click="onEdit(row.original)">{{
                $t("common.edit")
              }}</UButton>
            </div>
          </template>
        </UTable>
      </UPageBody>
    </UPage>
  </div>
</template>
