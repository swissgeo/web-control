const controlAPIBase = useRuntimeConfig().public.serviceControlBase;

// TODO: Use the correct organization of the user once available.
const TEMPORARY_ORG_ID = "test";

export const machineUsersUrl = () => {
  return `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers`;
};
export const machineUserUrl = (id: string) => {
  return `${controlAPIBase}/organizations/${TEMPORARY_ORG_ID}/machineusers/${id}`;
};

export interface MachineUser {
  client_id: string;
  client_secret?: string;
  name: string;
}

export interface CreateMachineUserRequest {
  name: string;
  tokenDuration: number;
}
