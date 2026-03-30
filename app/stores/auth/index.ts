import { defineStore } from "pinia";
import type { User } from "oidc-client-ts";
import useCognitoApi from "~/api/cognito";
import { EMPTY_PROFILE } from "~/stores/auth/profile";
import type { Profile } from "~/stores/auth/profile";

export interface AuthStoreState {
  cognito: ReturnType<typeof useCognitoApi>;
  user: User | null;
  loginUrl: string | undefined;
  profile: Profile;
}

export function authStoreState() {
  return (): AuthStoreState => {
    const cognito = useCognitoApi();
    return {
      cognito: cognito,
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
});
