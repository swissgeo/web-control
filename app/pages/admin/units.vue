<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useUnitsApi, type Unit } from "~/api/units";

const { toastError, toastSuccess } = useToastHelpers();
const { setPageTitle } = useMeta();
const { toastInfo } = useToastHelpers();

setPageTitle($t("unit.title"));

const units = ref<Unit[]>([]);
const loadingUnits = ref(false);

const tableColumns = computed<TableColumn<Unit>[]>(() => [
  {
    accessorKey: "id",
    header: $t("common.id"),
  },
  {
    accessorKey: "name",
    header: $t("common.name"),
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
  loadUnits();
});

async function loadUnits() {
  try {
    loadingUnits.value = true;
    units.value = await useUnitsApi().getUnits();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError($t("common.loadError"));
  } finally {
    loadingUnits.value = false;
  }
}

const onEdit = (row: Unit): void => {
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
