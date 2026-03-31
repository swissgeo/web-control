import type { Translations } from "~/api/common";

// TODO: Use the correct organization of the user once available.
const TEMPORARY_ORG_ID = "ch.swisstopo";

export interface Organization {
  id: string;
  name: string;
  name_translations: Translations;
  acronym: string;
  acronym_translations: Translations;
}

export function useOrganizationApi() {
  const { $controlAPI } = useNuxtApp();

  async function getOrganization(): Promise<Organization> {
    const org = await $controlAPI<Organization>(
      `organizations/${TEMPORARY_ORG_ID}`,
    );
    return org;
  }

  return {
    getOrganization,
  };
}
