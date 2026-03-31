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

  async function createUnit(unit: Unit): Promise<Unit> {
    const newUnit = await $controlAPI<Unit>(
      `organizations/${TEMPORARY_ORG_ID}/units`,
      {
        method: "POST",
        body: JSON.stringify({
          id: unit.id,
          organization_id: TEMPORARY_ORG_ID,
          name_translations: unit.name_translations,
        }),
      },
    );
    return newUnit;
  }
  async function updateUnit(unit: Unit): Promise<Unit> {
    const newUnit = await $controlAPI<Unit>(
      `organizations/${TEMPORARY_ORG_ID}/units/${unit.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          id: unit.id,
          organization_id: TEMPORARY_ORG_ID,
          name_translations: unit.name_translations,
        }),
      },
    );
    return newUnit;
  }

  async function deleteUnit(unitId: string): Promise<void> {
    await $controlAPI(`organizations/${TEMPORARY_ORG_ID}/units/${unitId}`, {
      method: "DELETE",
    });
  }

  return {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}
