import { defineStore } from "pinia";
import type { User, UserManager } from "oidc-client-ts";

export interface AuthStoreState {
  _userManager: UserManager | undefined;
  _userCache: User | undefined;
  loginUrl: string | undefined;
}

export function authStoreState() {
  return (): AuthStoreState => ({
    _userManager: undefined,
    _userCache: undefined,
    loginUrl: undefined,
  });
}

export const useAuthStore = defineStore("auth", {
  state: authStoreState(),
  getters: authGetters(),
  actions: authActions(),
});
