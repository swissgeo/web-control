import type { User } from "oidc-client-ts";
type thisAuthStore = ReturnType<typeof useAuthStore>;

export interface AuthStoreActions {
  init(this: thisAuthStore): Promise<void>;
  setLoginUrl(this: thisAuthStore, url: string): void;
  setUser(this: thisAuthStore, user: User | null): void;
  $reset(this: thisAuthStore): void;
}

export function authActions(): AuthStoreActions {
  return {
    async init() {
      // Trigger the user loading process to populate the store with the current user if available.
      // User is loaded asynchronously from the web storage.
      const user = await this.userManager.getUser();
      this.user = user;
      console.log("User initialized", user?.profile?.email);
    },

    setLoginUrl(this: thisAuthStore, url: string) {
      this.loginUrl = url;
    },

    setUser(this: thisAuthStore, user: User | null) {
      this.user = user;
    },

    $reset(this: thisAuthStore) {
      this.user = null;
      this.userManager.clearStaleState();
      this.userManager.removeUser();
    },
  };
}
