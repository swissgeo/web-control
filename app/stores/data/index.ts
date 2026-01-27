import { defineStore } from "pinia";
import { dataActions } from "~/stores/data/actions";

export interface MachineUser {
  client_id: string;
  client_secret?: string;
  name: string;
}

export interface MachineUserConfig {
  name: string;
  tokenDuration: number;
}

export interface DataStoreState {
  _machineUsers: MachineUser[] | undefined;
  _loadingMachineUsers: boolean;

  _addingMachineUser: boolean;
  _loadingCreateMachineUser: boolean;
  _createMachineUserResponse: MachineUser | undefined;
}

export function dataStoreState() {
  return (): DataStoreState => ({
    _machineUsers: [],
    _loadingMachineUsers: false,

    _addingMachineUser: false,
    _loadingCreateMachineUser: false,
    _createMachineUserResponse: undefined,
  });
}

export const useDataStore = defineStore("data", {
  state: dataStoreState(),
  getters: {
    machineUsers: (state) => state._machineUsers,
    loadingMachineUsers: (state) => state._loadingMachineUsers,
    addingMachineUser: (state) => state._addingMachineUser,
    loadingCreateMachineUsers: (state) => state._loadingCreateMachineUser,
    createMachineUserResponse: (state) => state._createMachineUserResponse,
  },
  actions: dataActions(),
});
