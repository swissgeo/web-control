type thisDataStore = ReturnType<typeof useDataStore>;

const controlAPIBase = useRuntimeConfig().public.serviceControlBase;

// TODO: Use the correct organization of the user once available.
const TEMPORARY_ORG_ID = "test";

export interface DataStoreActions {
  fetchMachineUsers(this: thisDataStore): void;
  startCreateMachineUser(this: thisDataStore): void;
  cancelCreateMachineUser(this: thisDataStore): void;
  createMachineUser(
    this: thisDataStore,
    machineUserConfig: MachineUserConfig,
  ): void;
  completeCreateMachineUser(this: thisDataStore): void;
  deleteMachineUser(this: thisDataStore, user: MachineUser): void;
}

export function dataActions(): DataStoreActions {
  return {
    async fetchMachineUsers() {
      this._loadingMachineUsers = true;
      try {
        const data = await $fetch<{ items: MachineUser[] }>(
          `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers`,
        );
        this._machineUsers = data.items;
      } catch (err: unknown) {
        // TODO: How do we handle error?
        console.log("err", err);
      } finally {
        this._loadingMachineUsers = false;
      }
    },
    startCreateMachineUser() {
      this._addingMachineUser = true;
    },
    cancelCreateMachineUser() {
      this._addingMachineUser = false;
    },
    async createMachineUser(
      this: thisDataStore,
      machineUserConfig: MachineUserConfig,
    ) {
      try {
        this._loadingCreateMachineUser = true;
        const data = await $fetch<MachineUser>(
          `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers`,
          {
            method: "POST",
            body: machineUserConfig,
          },
        );
        this._createMachineUserResponse = data;
      } catch (err: unknown) {
        // TODO: How do we handle error?
        console.log("err", err);
      } finally {
        this._loadingCreateMachineUser = false;
      }
    },
    completeCreateMachineUser() {
      this.fetchMachineUsers();
      this._addingMachineUser = false;
      this._createMachineUserResponse = undefined;
    },
    async deleteMachineUser(user: MachineUser) {
      try {
        await $fetch<MachineUser>(
          `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers/${user.client_id}`,
          {
            method: "DELETE",
          },
        );
      } catch (err: unknown) {
        // TODO: How do we handle error?
        console.log("err", err);
      } finally {
        this.fetchMachineUsers();
      }
    },
  };
}
