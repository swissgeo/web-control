import { defineStore } from "pinia";
import type { User } from "oidc-client-ts";
import useCognitoApi from "~/api/cognito";

export interface AuthStoreState {
  cognito: ReturnType<typeof useCognitoApi>;
  user: User | null;
  loginUrl: string | undefined;
}

export function authStoreState() {
  return (): AuthStoreState => {
    const cognito = useCognitoApi();
    return {
      cognito: cognito,
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
