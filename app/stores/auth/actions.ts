import type { User } from "oidc-client-ts";
import { EMPTY_PROFILE, profileFromUserProfile } from "~/stores/auth/profile";
type thisAuthStore = ReturnType<typeof useAuthStore>;

export interface AuthStoreActions {
  init(this: thisAuthStore): Promise<void>;
  login(
    this: thisAuthStore,
    config: { useCognitoOnly: boolean },
  ): Promise<void>;
  logout(this: thisAuthStore): Promise<void>;
  signinCallback(this: thisAuthStore): Promise<void>;
  setLoginUrl(this: thisAuthStore, url: string): void;
  setUser(this: thisAuthStore, user: User | null): void;
  setProfileForSuperUser(
    this: thisAuthStore,
    organizationId: string | undefined,
    unitId: string | undefined,
    roles: string[],
  ): void;
  $reset(this: thisAuthStore): void;
}

export function authActions(): AuthStoreActions {
  // initialize broadcast channel to sync user session across tabs
  const channel = new BroadcastChannel("auth");
  const CHANNEL_MESSAGE_LOGOUT = "logout";

  return {
    async init() {
      const router = useRouter();

      const userEventCb = (user: User | null) => {
        // When the user has been loaded/unloaded or updated (e.g. after a silent renew, logout) we
        // need to update the user in the store, so that the new tokens are available for API calls
        this.setUser(user);
        if (!user) {
          // When a user has been logged out we received a null user event and need to go to the login page
          router.push("/login");
        }
      };

      this.cognito.init(userEventCb);

      // Register listener for logout messages from other tabs. When we receive a logout message,
      // we clear the user from the store and go to the login page
      channel.onmessage = (event) => {
        if (event.data === CHANNEL_MESSAGE_LOGOUT) {
          console.log(
            "Received logout message from another tab, go to login page",
          );
          // clear the user from the store
          userEventCb(null);
        }
      };

      // when opening the app (first load, reload or load in another tab) we need to check if there
      // is already a user session saved in cognito local storate and set the user in the store.
      this.setUser(await this.cognito.getUser());
      console.log("User:", this.user?.profile?.email);
    },

    async login(config): Promise<void> {
      this.loginConfig = config;
      await this.cognito.login(config);
    },

    async logout(): Promise<void> {
      // Inform other tabs that the use has logged out
      channel.postMessage(CHANNEL_MESSAGE_LOGOUT);
      await this.cognito.logout(this.loginConfig);
      this.loginConfig = { useCognitoOnly: false };
    },

    async signinCallback(): Promise<void> {
      const user = await this.cognito.signinCallback();
      console.log("User signed in, email:", user.profile?.email);
      this.setUser(user);
    },

    setLoginUrl(this: thisAuthStore, url: string) {
      this.loginUrl = url;
    },

    setUser(this: thisAuthStore, user: User | null) {
      this.user = user;
      const superuserGroup = useRuntimeConfig().public.superuserGroup;
      this.profile = user
        ? profileFromUserProfile(user.profile, superuserGroup)
        : { ...EMPTY_PROFILE };
    },

    setProfileForSuperUser(
      this: thisAuthStore,
      organizationId: string | undefined,
      unitId: string | undefined,
      roles: string[],
    ) {
      this.profile = {
        ...this.profile,
        organizationId,
        unitId,
        roles,
      };
    },

    $reset(this: thisAuthStore) {
      this.user = null;
      this.profile = { ...EMPTY_PROFILE };
      this.cognito.reset();
    },
  };
}
