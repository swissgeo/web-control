import type { Translations } from "~/api/common";

// TODO: Use the correct organization of the user once available.
const TEMPORARY_ORG_ID = "ch.swisstopo";

export interface Unit {
  id: string;
  name: string;
  name_translations: Translations;
  organization_id: string;
}

export function useUnitsApi() {
  const { $controlAPI } = useNuxtApp();

  async function getUnits(): Promise<Unit[]> {
    const { items } = await $controlAPI<{ items: Unit[] }>(
      `organizations/${TEMPORARY_ORG_ID}/units`,
    );
    return items;
  }

  async function deleteUnit(unitId: string): Promise<void> {
    await $controlAPI(`organizations/${TEMPORARY_ORG_ID}/units/${unitId}`, {
      method: "DELETE",
    });
  }

  return {
    getUnits,
    deleteUnit,
  };
}
