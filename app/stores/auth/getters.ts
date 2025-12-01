import type { IdTokenClaims, User, UserManager } from "oidc-client-ts";
import type { _GettersTree } from "pinia";
import useCognitoApi from "~/api/cognito";

type thisAuthStore = ReturnType<typeof useAuthStore>;

export interface AuthStoreGetters {
  profile(state: AuthStoreState): IdTokenClaims;
  userManager(state: AuthStoreState): UserManager;
  isLoggedIn(state: AuthStoreState): boolean;
  isLoggedInSync(this: thisAuthStore): Promise<boolean>;
  accessData(this: thisAuthStore): User | undefined;
  accessToken(this: thisAuthStore): string | undefined;
}

export function authGetters(): _GettersTree<AuthStoreState> {
  return {
    profile(this: thisAuthStore) {
      this._getUserToCache();
      return (
        this._userCache?.profile || {
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

    userManager(state) {
      if (!state._userManager) {
        const cognitoApi = useCognitoApi();
        state._userManager = cognitoApi.initUserManager();
      }
      return state._userManager;
    },

    isLoggedIn(state) {
      return !!state._userCache;
    },

    async isLoggedInSync(this: thisAuthStore) {
      return !!(await this.userManager.getUser());
    },

    accessData(this: thisAuthStore) {
      this._getUserToCache();
      return this._userCache;
    },

    accessToken(this: thisAuthStore) {
      this._getUserToCache();
      return this._userCache?.access_token;
    },
  };
}
