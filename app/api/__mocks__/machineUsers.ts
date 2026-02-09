import { vi } from "vitest";

export const getMachineUsers = vi
  .fn()
  .mockResolvedValue([{ client_id: "mock_client_id", name: "Mock Name" }]);
export const createMachineUser = vi.fn();
export const deleteMachineUser = vi.fn();

export const useMachineUsersApi = () => ({
  getMachineUsers: getMachineUsers,
  createMachineUser: createMachineUser,
  deleteMachineUser: deleteMachineUser,
});
