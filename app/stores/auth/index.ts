import { defineStore } from "pinia";
import type { User, UserManager } from "oidc-client-ts";
import useCognitoApi from "~/api/cognito";

export interface AuthStoreState {
  userManager: UserManager;
  user: User | null;
  loginUrl: string | undefined;
}

export function authStoreState() {
  return (): AuthStoreState => {
    const cognitoApi = useCognitoApi();
    const manager = cognitoApi.initUserManager();
    return {
      userManager: manager,
      user: null,
      loginUrl: undefined,
    };
  };
}

export const useAuthStore = defineStore("auth", {
  state: authStoreState(),
  getters: authGetters(),
  actions: authActions(),
});
