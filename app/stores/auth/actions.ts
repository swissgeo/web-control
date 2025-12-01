import type { User } from "oidc-client-ts";

type thisAuthStore = ReturnType<typeof useAuthStore>;

export interface AuthStoreActions {
  _getUserToCache(this: thisAuthStore): void;
  setLoginUrl(this: thisAuthStore, url: string): void;
  $reset(this: thisAuthStore): void;
}

export function authActions(): AuthStoreActions {
  return {
    /*
     * getUser is a promise, so if we don't have the data yet
     * we dispatch the call and in the meantime return empty values
     * so that further down the chain we don't have to handle promises
     */
    _getUserToCache(this: ReturnType<typeof useAuthStore>) {
      if (!this._userCache) {
        this.userManager.getUser().then((user: User | null) => {
          if (user) {
            // see if this is allowed here
            this._userCache = user;
          }
        });
      }
    },

    setLoginUrl(this: thisAuthStore, url: string) {
      this.loginUrl = url;
    },

    $reset(this: thisAuthStore) {
      this._userManager = undefined;
    },
  };
}
