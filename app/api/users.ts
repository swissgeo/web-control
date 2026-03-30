import type { Unit } from "~/api/units";
import { getOrganizationId } from "~/api/common";

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

export interface UpdateUser {
  id: string;
  role_ids: string[];
  unit_id: string | null;
}

export function useUsersApi() {
  const { $controlAPI } = useNuxtApp();

  async function getRoles(): Promise<Role[]> {
    const { items } = await $controlAPI<{ items: Role[] }>(`roles`);
    return items;
  }

  async function getUsers(organizationId?: string): Promise<User[]> {
    const currentOrganizationId = getOrganizationId(organizationId);
    const { items } = await $controlAPI<{ items: User[] }>(
      `organizations/${currentOrganizationId}/users`,
    );
    return items;
  }

  async function updateUser(
    user: UpdateUser,
    organizationId?: string,
  ): Promise<User> {
    const currentOrganizationId = getOrganizationId(organizationId);
    const updatedUser = await $controlAPI<User>(
      `organizations/${currentOrganizationId}/users/${user.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          roles: user.role_ids,
          unit_id: user.unit_id,
        }),
      },
    );
    return updatedUser;
  }

  async function deleteUser(
    userId: string,
    organizationId?: string,
  ): Promise<void> {
    const currentOrganizationId = getOrganizationId(organizationId);
    await $controlAPI(
      `organizations/${currentOrganizationId}/users/${userId}`,
      {
        method: "DELETE",
      },
    );
  }

  return {
    getRoles,
    getUsers,
    updateUser,
    deleteUser,
  };
}
