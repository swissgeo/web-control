import { vi } from "vitest";

export const getUsers = vi.fn().mockResolvedValue([
  {
    id: "mock-user-id",
    email: "mock-user@example.com",
    first_name: "Mock",
    last_name: "User",
    roles: [{ name: "Organization Admin" }],
    unit: { name: "mock-unit" },
  },
]);
export const deleteUser = vi.fn();

export const useUsersApi = () => ({
  getUsers: getUsers,
  deleteUser: deleteUser,
});
