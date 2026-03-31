import { getOrganizationId, type Translations } from "~/api/common";

export interface Unit {
  id: string;
  name: string;
  name_translations: Translations;
  organization_id: string;
}

export function useUnitsApi() {
  const { $controlAPI } = useNuxtApp();

  async function getUnits(): Promise<Unit[]> {
    return getUnitsByOrganization(getOrganizationId());
  }

  // Special case for superuser we can pass an organization id
  async function getUnitsByOrganization(
    organizationId: string,
  ): Promise<Unit[]> {
    const { items } = await $controlAPI<{ items: Unit[] }>(
      `organizations/${organizationId}/units`,
    );
    return items;
  }

  async function createUnit(unit: Unit): Promise<Unit> {
    const organizationId = getOrganizationId();
    const newUnit = await $controlAPI<Unit>(
      `organizations/${organizationId}/units`,
      {
        method: "POST",
        body: JSON.stringify({
          id: unit.id,
          organization_id: organizationId,
          name_translations: unit.name_translations,
        }),
      },
    );
    return newUnit;
  }
  async function updateUnit(unit: Unit): Promise<Unit> {
    const organizationId = getOrganizationId();
    const newUnit = await $controlAPI<Unit>(
      `organizations/${organizationId}/units/${unit.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          id: unit.id,
          organization_id: organizationId,
          name_translations: unit.name_translations,
        }),
      },
    );
    return newUnit;
  }

  async function deleteUnit(unitId: string): Promise<void> {
    const organizationId = getOrganizationId();
    await $controlAPI(`organizations/${organizationId}/units/${unitId}`, {
      method: "DELETE",
    });
  }

  return {
    getUnits,
    getUnitsByOrganization,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}
