<script setup lang="ts">
import type { TableColumn, FormSubmitEvent } from "@nuxt/ui";
import { useDataStore, type MachineUser } from "~/stores/data";
import * as v from "valibot";

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

// -------- Create Users --------------

const schema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty("Name is required"),
    v.minLength(3, "Must be at least 3 characters"),
    v.maxLength(50, "Must not be more than 50 characters"),
    v.check(
      (item) =>
        dataStore.machineUsers?.find((m) => m.name === item) === undefined,
      "Machine user with this name already exists",
    ),
  ),
  tokenDuration: v.pipe(
    v.number(),
    v.minValue(1, "Must be at least 1 minute"),
    v.maxValue(60, "Maximum 1 hour"),
  ),
});

const state = reactive({
  name: "",
  tokenDuration: 15,
});

type Schema = v.InferOutput<typeof schema>;
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  dataStore.createMachineUser(event.data);
}
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
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-1.5">
          <UInput
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter (not yet implemented)"
          />

          <div class="flex flex-wrap items-center gap-1.5">
            <UButton
              label="Add Machine User"
              variant="subtle"
              @click="dataStore.startCreateMachineUser()"
            />
          </div>
        </div>

        <UModal
          :open="dataStore.addingMachineUser"
          title="New Machine User"
          description="After creation you will receive a client id and secret."
          :close="false"
          :dismissible="false"
          :ui="{ footer: 'justify-end' }"
        >
          <template #body>
            <template v-if="dataStore.createMachineUserResponse === undefined">
              <UForm :schema="schema" :state="state" @submit="onSubmit">
                <UFormField label="Name" name="name">
                  <UInput v-model="state.name" />
                </UFormField>
                <UFormField
                  label="Token Duration in Minutes"
                  name="tokenDuration"
                >
                  <UInput v-model="state.tokenDuration" type="number" />
                </UFormField>
                <div class="flex shrink-0 p-6 justify-end">
                  <UButton
                    class="m-1"
                    label="Cancel"
                    color="neutral"
                    @click="dataStore.cancelCreateMachineUser()"
                  />
                  <UButton
                    class="m-1"
                    type="submit"
                    label="Submit"
                    color="primary"
                  />
                </div>
              </UForm>
            </template>
            <template v-if="dataStore.createMachineUserResponse !== undefined">
              <UAlert
                color="error"
                description="Copy the secret to a secure location (e.g. password manager). After closing this dialog you will not be able to see the secret again."
              />
              <div class="flex flex-col shrink-0 p-6">
                <UFormField label="ID">
                  <UInput
                    v-model="dataStore.createMachineUserResponse.client_id"
                    disabled
                  />
                </UFormField>
                <UFormField label="Secret">
                  <UInput
                    v-model="dataStore.createMachineUserResponse.client_secret"
                    disabled
                  />
                </UFormField>
              </div>
              <UButton
                class="m-1"
                label="Done"
                color="primary"
                @click="dataStore.completeCreateMachineUser()"
              />
            </template>
          </template>
        </UModal>

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
