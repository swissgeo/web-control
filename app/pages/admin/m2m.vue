<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import CreateMachineForm from "~/components/m2m/CreateMachineForm.vue";
import MachineSecret from "~/components/m2m/MachineSecret.vue";
import {
  type MachineUser,
  type CreateMachineUserRequest,
  useMachineUsersApi,
} from "~/api/machineUsers";

const { toastError, toastSuccess } = useToastHelpers();
const { setPageTitle } = useMeta();

setPageTitle($t("machineUser.title"));

const defaultM2MScope = useRuntimeConfig().public.defaultM2MScope;
const authUrl = useRuntimeConfig().public.cognitoUrl;

const machineUsers = ref<MachineUser[]>();
const machineUserDetails = ref<MachineUser>();
const displayCreateModal = ref(false);
const displaySecretModal = ref(false);
const loadingMachineUsers = ref(false);
const loadingCreateMachineUser = ref(false);

const tableColumns = computed<TableColumn<MachineUser>[]>(() => [
  {
    accessorKey: "client_id",
    header: $t("machineUser.clientId"),
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
  loadMachineUsers();
});

async function loadMachineUsers() {
  try {
    loadingMachineUsers.value = true;
    machineUsers.value = await useMachineUsersApi().getMachineUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError($t("machineUser.loadError"));
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
    toastSuccess($t("machineUser.successCreated"));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError($t("machineUser.errorCreate"));
  } finally {
    loadingCreateMachineUser.value = false;
    displaySecretModal.value = true;
  }
}

// TODO: creating a new machine user should update the table

// TODO: deleting a machine user should use some sort of modal

async function deleteMachineUser(row: MachineUser) {
  try {
    await useMachineUsersApi().deleteMachineUser(row.client_id);
    toastSuccess($t("machineUser.successDelete"));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toastError($t("machineUser.errorDelete"));
  } finally {
    loadMachineUsers();
  }
}
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('machineUser.title')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <p>{{ $t("machineUser.description") }}</p>
        <ToolBar>
          <!-- <UInput
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter (not yet implemented)"
          /> -->
          <template #right>
            <UButton
              :label="$t('machineUser.create')"
              variant="solid"
              :disabled="displayCreateModal"
              @click="startCreateMachineUser()"
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
            v-if="displayCreateModal"
            class="overflow-hidden"
            :ui="{ container: 'py-4! gap-4!', description: 'mt-2' }"
          >
            <UCard>
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
            </UCard>
          </UPageSection>
        </Transition>

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
                {{ $t("common.delete") }}
              </UButton>
            </div>
          </template>
        </UTable>
        <UPageSection :ui="{ container: 'py-4! gap-4!', description: 'mt-2' }">
          <p>{{ $t("machineUser.generateToken") }}</p>
          <pre>
curl -X POST {{ authUrl }}/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&amp;client_id=&lt;CLIENT_ID&gt;&amp;client_secret=&lt;CLIENT_SECRET&gt;&amp;scope={{
              defaultM2MScope
            }}"
          </pre>
        </UPageSection>
      </UPageBody>
    </UPage>
  </div>
</template>
