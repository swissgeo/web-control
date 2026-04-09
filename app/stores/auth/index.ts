import { defineStore } from "pinia";
import type { User } from "oidc-client-ts";
import useCognitoApi from "~/api/cognito";
import { EMPTY_PROFILE } from "~/stores/auth/profile";
import type { Profile } from "~/stores/auth/profile";

export interface AuthStoreState {
  cognito: ReturnType<typeof useCognitoApi>;
  noEIAMCognito: ReturnType<typeof useCognitoApi> | null;
  usingCognitoOnly: boolean;
  user: User | null;
  loginUrl: string | undefined;
  profile: Profile;
}

export function authStoreState() {
  return (): AuthStoreState => {
    const cognito = useCognitoApi();
    let noEIAMCognito = null;
    if (useRuntimeConfig().public.environment !== "prod") {
      noEIAMCognito = useCognitoApi(true);
    }
    return {
      cognito: cognito,
      noEIAMCognito: noEIAMCognito,
      usingCognitoOnly: false,
      user: null,
      loginUrl: undefined,
      profile: { ...EMPTY_PROFILE },
    };
  };
}

export const useAuthStore = defineStore("auth", {
  state: authStoreState(),
  getters: authGetters(),
  actions: authActions(),
  persist: true,
});
