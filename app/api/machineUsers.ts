import { getOrganizationId } from "~/api/common";

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
  const { $controlAPI } = useNuxtApp();

  async function getMachineUsers(): Promise<MachineUser[]> {
    const organizationId = getOrganizationId();
    const { items } = await $controlAPI<{ items: MachineUser[] }>(
      `organizations/${organizationId}/machineusers`,
    );
    return items;
  }

  async function createMachineUser(
    request: CreateMachineUserRequest,
  ): Promise<MachineUser> {
    const organizationId = getOrganizationId();
    return await $controlAPI(`organizations/${organizationId}/machineusers`, {
      method: "POST",
      body: request,
    });
  }

  async function deleteMachineUser(clientId: string): Promise<void> {
    const organizationId = getOrganizationId();
    await $controlAPI(
      `organizations/${organizationId}/machineusers/${clientId}`,
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
