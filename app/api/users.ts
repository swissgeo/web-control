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

export interface AccessRequest {
  id: string;
  state: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  created: string;
  organization_id: string;
  organization_acronym: string;
  organization_name: string;
  user: User;
}

export function useUsersApi() {
  const { $controlAPI } = useNuxtApp();

  async function getRoles(): Promise<Role[]> {
    const { items } = await $controlAPI<{ items: Role[] }>(`roles`);
    return items;
  }

  async function getUsers(): Promise<User[]> {
    const organizationId = getOrganizationId();
    const { items } = await $controlAPI<{ items: User[] }>(
      `organizations/${organizationId}/users`,
    );
    return items;
  }

  async function updateUser(user: UpdateUser): Promise<User> {
    const organizationId = getOrganizationId();
    const updatedUser = await $controlAPI<User>(
      `organizations/${organizationId}/users/${user.id}`,
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

  async function removeUser(userId: string): Promise<void> {
    const organizationId = getOrganizationId();
    await $controlAPI(`organizations/${organizationId}/users/${userId}`, {
      method: "DELETE",
    });
  }

  async function pendingAccessRequest(): Promise<AccessRequest | null> {
    const { items } = await $controlAPI<{ items: AccessRequest[] }>(
      `accessrequests`,
    );
    return items.find((r) => r.state === "PENDING") || null;
  }

  async function createAccessRequest(
    organizationId: string,
  ): Promise<AccessRequest> {
    const accessRequest = await $controlAPI<AccessRequest>("accessrequests", {
      method: "POST",
      body: JSON.stringify({
        organization_id: organizationId,
      }),
    });
    return accessRequest;
  }

  async function cancelAccessRequest(requestId: string): Promise<void> {
    await $controlAPI(`accessrequests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({
        state: "CANCELLED",
      }),
    });
  }

  async function getAccessRequests(): Promise<AccessRequest[]> {
    const { items } = await $controlAPI<{ items: AccessRequest[] }>(
      `organizations/${getOrganizationId()}/accessrequests`,
    );
    return items;
  }

  async function updateAccessRequest(
    accessRequestId: string,
    state: "APPROVED" | "DECLINED",
    roles: string[] | null,
    unit_id: string | null,
  ): Promise<AccessRequest> {
    const accessRequest = await $controlAPI<AccessRequest>(
      `organizations/${getOrganizationId()}/accessrequests/${accessRequestId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          state,
          roles,
          unit_id,
        }),
      },
    );
    return accessRequest;
  }

  return {
    getRoles,
    getUsers,
    updateUser,
    removeUser,
    pendingAccessRequest,
    createAccessRequest,
    cancelAccessRequest,
    getAccessRequests,
    updateAccessRequest,
  };
}
