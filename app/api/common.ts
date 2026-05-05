export interface Translations {
  de: string;
  fr: string;
  en: string;
  it?: string;
  rm?: string;
}

export function getOrganizationId(): string {
  const authStore = useAuthStore();
  const profileOrganizationId = authStore.profile.organizationId;
  if (profileOrganizationId) return profileOrganizationId;

  throw new Error("No organization ID available in auth store.");
}
