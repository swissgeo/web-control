<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useUnitsApi, type Unit } from "~/api/units";
import DetailUnitForm from "~/components/unit/detailUnitForm.vue";

definePageMeta({
  middleware: ["organization-admin"],
});

const { toastError, toastSuccess } = useToastHelpers();
const { setPageTitle } = useMeta();

setPageTitle($t("unit.title"));

const units = ref<Unit[]>([]);
const displayDetailModal = ref(false);
const selectedUnit = ref<Unit>();

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
    units.value = await useUnitsApi().getUnits();
  } catch (err: unknown) {
    console.error("Failed to load units", err);
    toastError($t("common.loadError"));
  }
}

const onEdit = (row: Unit): void => {
  selectedUnit.value = row;
  displayDetailModal.value = true;
};

function openUnitDetails() {
  selectedUnit.value = undefined;
  displayDetailModal.value = true;
}

function closeUnitDetails() {
  displayDetailModal.value = false;
}

function saveUnit(data: Unit) {
  if (selectedUnit.value) {
    updateUnit(data);
  } else {
    createUnit(data);
  }
}

async function createUnit(data: Unit) {
  try {
    await useUnitsApi().createUnit(data);
    toastSuccess($t("unit.createSuccess"));
    loadUnits();
    closeUnitDetails();
  } catch (err: unknown) {
    console.error("Failed to create unit", err);
    toastError($t("unit.errorCreate"));
  }
}

async function updateUnit(data: Unit) {
  try {
    await useUnitsApi().updateUnit(data);
    toastSuccess($t("unit.updateSuccess"));
    loadUnits();
    closeUnitDetails();
  } catch (err: unknown) {
    console.error("Failed to update unit", err);
    toastError($t("unit.errorUpdate"));
  }
}
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
        <ToolBar>
          <template #right>
            <UButton
              :label="$t('unit.create')"
              variant="solid"
              :disabled="displayDetailModal"
              @click="openUnitDetails()"
            />
          </template>
        </ToolBar>

        <Transition
          enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          enter-from-class="max-h-0"
          enter-to-class="max-h-[500px] opacity-100"
          leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          leave-from-class="max-h-[500px] opacity-100"
          leave-to-class="max-h-0"
        >
          <UPageSection
            v-if="displayDetailModal"
            class="overflow-hidden"
            :ui="{ container: 'py-4! gap-4!', description: 'mt-2' }"
          >
            <DetailUnitForm
              :existing-unit="selectedUnit"
              @submit="saveUnit($event)"
              @cancel="closeUnitDetails()"
            />
          </UPageSection>
        </Transition>

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
