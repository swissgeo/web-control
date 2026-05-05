import type { _GettersTree } from "pinia";

type thisAuthStore = ReturnType<typeof useAuthStore>;

export interface AuthStoreGetters {
  isLoggedIn(state: AuthStoreState): boolean;
  accessToken(this: thisAuthStore): string | undefined;
  idToken(this: thisAuthStore): string | undefined;
}

export function authGetters(): _GettersTree<AuthStoreState> {
  return {
    organizationId(this: thisAuthStore) {
      return this.profile.organizationId || "";
    },
    unitId(this: thisAuthStore) {
      return this.profile.unitId || "";
    },
    isOrganizationAdmin(this: thisAuthStore) {
      return this.profile.roles?.includes("org_admin") ?? false;
    },
    isDatasetAdmin(this: thisAuthStore) {
      return this.profile.roles?.includes("dataset_admin") ?? false;
    },
    isDatasetContributor(this: thisAuthStore) {
      return this.profile.roles?.includes("dataset_contributor") ?? false;
    },
    canManageDatasets(this: thisAuthStore) {
      return (
        this.isOrganizationAdmin ||
        this.isDatasetAdmin ||
        this.isDatasetContributor
      );
    },
    canManageOrganization(this: thisAuthStore) {
      return this.isOrganizationAdmin;
    },

    isLoggedIn(this: thisAuthStore) {
      return !!this.user && !this.user.expired;
    },

    accessToken(this: thisAuthStore) {
      return this.user?.access_token;
    },

    idToken(this: thisAuthStore) {
      return this.user?.id_token;
    },
  };
}
