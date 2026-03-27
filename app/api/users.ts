import type { Unit } from "~/api/units";

// TODO: Use the correct organization of the user once available.
const TEMPORARY_ORG_ID = "ch.swisstopo";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: Role[];
  unit: Unit;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export function useUsersApi() {
  const { $controlAPI } = useNuxtApp();

  async function getUsers(): Promise<User[]> {
    const { items } = await $controlAPI<{ items: User[] }>(
      `organizations/${TEMPORARY_ORG_ID}/users`,
    );
    return items;
  }

  async function deleteUser(userId: string): Promise<void> {
    await $controlAPI(`organizations/${TEMPORARY_ORG_ID}/users/${userId}`, {
      method: "DELETE",
    });
  }

  return {
    getUsers,
    deleteUser,
  };
}
