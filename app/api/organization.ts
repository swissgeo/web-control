import { getOrganizationId, type Translations } from "~/api/common";

export interface Organization {
  id: string;
  name: string;
  name_translations: Translations;
  acronym: string;
  acronym_translations: Translations;
}

export function useOrganizationApi() {
  const { $controlAPI } = useNuxtApp();

  async function getOrganizations(): Promise<Organization[]> {
    const { items } = await $controlAPI<{ items: Organization[] }>(
      `organizations`,
    );
    return items;
  }

  async function getOrganization(): Promise<Organization> {
    const organizationId = getOrganizationId();
    const org = await $controlAPI<Organization>(
      `organizations/${organizationId}`,
    );
    return org;
  }

  return {
    getOrganizations,
    getOrganization,
  };
}
