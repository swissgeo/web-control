import { vi } from "vitest";

export const getOrganization = vi.fn().mockResolvedValue({
  id: "mock-org-id",
  name: "Mock Organization",
  name_translations: {
    en: "Mock Organization",
    fr: "Organisation Mock",
    de: "Mock Organisation",
    it: "Organizzazione Mock",
    rm: "Organisaziun Mock",
  },
  acronym: "EM",
  acronym_translations: {
    en: "EM",
    fr: "FM",
    de: "DM",
    it: "IM",
    rm: "RM",
  },
});

export const useOrganizationApi = () => ({
  getOrganization: getOrganization,
});
