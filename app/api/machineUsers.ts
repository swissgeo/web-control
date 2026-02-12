// TODO: Use the correct organization of the user once available.
const TEMPORARY_ORG_ID = "test";

export interface MachineUser {
  client_id: string;
  client_secret?: string;
  name: string;
}

export interface CreateMachineUserRequest {
  name: string;
  tokenDuration: number;
}

export function useMachineUsersApi() {
  const {
    public: { serviceControlBase: controlAPIBase },
  } = useRuntimeConfig();

  async function getMachineUsers(): Promise<MachineUser[]> {
    const { items } = await $fetch<{ items: MachineUser[] }>(
      `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers`,
    );
    return items;
  }

  async function createMachineUser(
    request: CreateMachineUserRequest,
  ): Promise<MachineUser> {
    return await $fetch(
      `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers`,
      {
        method: "POST",
        body: request,
      },
    );
  }

  async function deleteMachineUser(clientId: string): Promise<void> {
    await $fetch(
      `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers/${clientId}`,
      {
        method: "DELETE",
      },
    );
  }

  return {
    getMachineUsers,
    createMachineUser,
    deleteMachineUser,
  };
}
