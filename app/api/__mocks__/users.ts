import { vi } from "vitest";

export const getRoles = vi.fn().mockResolvedValue([
  {
    id: "org_admin",
    name: "Organization Admin",
    description: "Admin role for the organization",
  },
  {
    id: "dataset_admin",
    name: "Dataset Admin",
    description: "Admin role for datasets",
  },
  {
    id: "dataset_contributor",
    name: "Dataset Contributor",
    description: "Contributor role for datasets",
  },
]);
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
export const updateUser = vi.fn().mockResolvedValue({
  id: "mock-user-id",
  email: "mock-user@example.com",
  first_name: "Mock",
  last_name: "User",
  roles: [{ name: "Organization Admin" }],
  unit: { name: "mock-unit" },
});
export const deleteUser = vi.fn();

export const useUsersApi = () => ({
  getRoles: getRoles,
  getUsers: getUsers,
  updateUser: updateUser,
  deleteUser: deleteUser,
});
