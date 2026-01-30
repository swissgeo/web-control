<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useDataStore, type MachineUser } from "~/stores/data";
import CreateMachineForm from "~/components/m2m/CreateMachineForm.vue";
import MachineSecret from "~/components/m2m/MachineSecret.vue";

const { setPageTitle } = useMeta();
const UButton = resolveComponent("UButton");

setPageTitle("M2M");

// -------- View Users --------------

const dataStore = useDataStore();
dataStore.fetchMachineUsers();

const tableColumns: TableColumn<MachineUser>[] = [
  {
    accessorKey: "client_id",
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

const onDelete = (row: MachineUser): void => {
  dataStore.deleteMachineUser(row);
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('Machine Users')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <ToolBar>
          <UInput
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter (not yet implemented)"
          />
          <template #right>
            <UButton
              label="Add Machine User"
              variant="subtle"
              @click="dataStore.startCreateMachineUser()"
            />
          </template>
        </ToolBar>

        <UProgress v-if="dataStore.loadingMachineUsers" animation="swing" />
        <UTable
          v-if="!dataStore.loadingMachineUsers"
          :columns="tableColumns"
          :data="dataStore.machineUsers"
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
              <UButton color="neutral" @click="onDelete(row.original)">
                Delete
              </UButton>
            </div>
          </template>
        </UTable>
      </UPageBody>
    </UPage>

    <UModal
      :open="dataStore.addingMachineUser"
      title="New Machine User"
      description="After creation you will receive a client id and secret."
      :close="false"
      :dismissible="false"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <CreateMachineForm
          v-if="dataStore.createMachineUserStep1"
          :existing-machine-users="dataStore.machineUsers"
          @submit="dataStore.createMachineUser($event.data)"
          @cancel="dataStore.cancelCreateMachineUser()"
        />
        <MachineSecret
          v-if="
            dataStore.createMachineUserStep2 &&
            dataStore.createMachineUserResponse
          "
          :machine-details="dataStore.createMachineUserResponse"
          @close="dataStore.completeCreateMachineUser()"
        />
      </template>
    </UModal>
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
