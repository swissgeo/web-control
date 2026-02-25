import type { UserProfile } from "oidc-client-ts";
import type { _GettersTree } from "pinia";

type thisAuthStore = ReturnType<typeof useAuthStore>;

export interface AuthStoreGetters {
  profile(state: AuthStoreState): UserProfile;
  isLoggedIn(state: AuthStoreState): boolean;
  accessToken(this: thisAuthStore): string | undefined;
  idToken(this: thisAuthStore): string | undefined;
}

export function authGetters(): _GettersTree<AuthStoreState> {
  return {
    profile(this: thisAuthStore) {
      return (
        this.user?.profile || {
          sub: "",
          iss: "",
          exp: 0,
          aud: "",
          iat: 0,
          given_name: "",
          family_name: "",
        }
      );
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
