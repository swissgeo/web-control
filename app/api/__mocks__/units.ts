import { vi } from "vitest";

export const getUnits = vi.fn().mockResolvedValue([
  {
    id: "mock-unit-id",
    name: "Mock Unit",
    name_translations: {
      en: "Mock Unit",
      fr: "Unité Mock",
      de: "Mock Einheit",
      it: "Unità Mock",
      rm: "Unit Mock",
    },
    organization_id: "mock.org",
  },
]);
export const deleteUnits = vi.fn();

export const useUnitsApi = () => ({
  getUnits: getUnits,
  deleteUnits: deleteUnits,
});
