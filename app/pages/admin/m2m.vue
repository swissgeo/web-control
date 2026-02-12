<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import CreateMachineForm from "~/components/m2m/CreateMachineForm.vue";
import MachineSecret from "~/components/m2m/MachineSecret.vue";
import {
  type MachineUser,
  type CreateMachineUserRequest,
  useMachineUsersApi,
} from "~/api/machineUsers";

const { setPageTitle } = useMeta();
setPageTitle("M2M");

const defaultM2MScope = useRuntimeConfig().public.defaultM2MScope;
const authDomain = useRuntimeConfig().public.cognitoDomain;

const machineUsers = ref<MachineUser[]>();
const machineUserDetails = ref<MachineUser>();
const displayCreateModal = ref(false);
const displaySecretModal = ref(false);
const loadingMachineUsers = ref(false);
const loadingCreateMachineUser = ref(false);

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

onMounted(() => {
  loadMachineUsers();
});

async function loadMachineUsers() {
  try {
    loadingMachineUsers.value = true;
    machineUsers.value = await useMachineUsersApi().getMachineUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError("Could not load data");
  } finally {
    loadingMachineUsers.value = false;
  }
}

function startCreateMachineUser() {
  displayCreateModal.value = true;
}

function cancelCreateMachineUser() {
  displayCreateModal.value = false;
}

function completeCreateMachineUser() {
  displayCreateModal.value = false;
  machineUserDetails.value = undefined;
  displaySecretModal.value = false;
  loadMachineUsers();
}

async function createMachineUser(data: CreateMachineUserRequest) {
  loadingCreateMachineUser.value = true;
  try {
    machineUserDetails.value =
      await useMachineUsersApi().createMachineUser(data);
    toastSuccess("Machine user created");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError("Could not create machine user");
  } finally {
    loadingCreateMachineUser.value = false;
    displaySecretModal.value = true;
  }
}

async function deleteMachineUser(row: MachineUser) {
  try {
    await useMachineUsersApi().deleteMachineUser(row.client_id);
    toastSuccess("Machine user deleted");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError("Could not delete machine user");
  } finally {
    loadMachineUsers();
  }
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
        <ToolBar>
          <UInput
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter (not yet implemented)"
          />
          <template #right>
            <UButton
              label="Add Machine User"
              variant="solid"
              @click="startCreateMachineUser()"
            />
          </template>
        </ToolBar>

        <UProgress v-if="loadingMachineUsers" animation="swing" />
        <UTable
          v-if="!loadingMachineUsers"
          :columns="tableColumns"
          :data="machineUsers"
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
              <UButton
                variant="solid"
                color="warning"
                @click="deleteMachineUser(row.original)"
              >
                Delete
              </UButton>
            </div>
          </template>
        </UTable>
        <UPageSection>
          <p>Use the following command to generate an access token:</p>
          <pre>
curl -X POST https://{{ authDomain }}/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&amp;client_id=&lt;CLIENT_ID&gt;&amp;client_secret=&lt;CLIENT_SECRET&gt;&amp;scope={{
              defaultM2MScope
            }}"
          </pre>
        </UPageSection>
      </UPageBody>
    </UPage>

    <UModal
      :open="displayCreateModal"
      title="New Machine User"
      description="After creation you will receive a client id and secret."
      :close="false"
      :dismissible="false"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <CreateMachineForm
          v-if="!displaySecretModal"
          :existing-machine-users="machineUsers"
          @submit="createMachineUser($event.data)"
          @cancel="cancelCreateMachineUser()"
        />
        <MachineSecret
          v-if="displaySecretModal && machineUserDetails"
          :machine-details="machineUserDetails"
          @close="completeCreateMachineUser()"
        />
      </template>
    </UModal>
  </div>
</template>
