import type { User } from "oidc-client-ts";
import { UserManager, Log, WebStorageStateStore } from "oidc-client-ts";

export enum LOGIN_MODE {
  END_USER = "end_user",
}

/**
 * API to the cognito endpoint using oidc client
 */
export default function useCognitoApi() {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();

  // Setup oidc-client-ts library logger
  Log.setLogger(console);

  const CLIENT_ID = runtimeConfig.public.cognitoAppClientId;

  // initialize broadcast channel to sync user session across tabs
  const channel = new BroadcastChannel("auth");
  const CHANNEL_MESSAGE_LOGOUT = "logout";
  channel.onmessage = (event) => {
    if (event.data === CHANNEL_MESSAGE_LOGOUT) {
      console.log("Received logout message from another tab, go to login page");
      // clear the user from the store
      authStore.setUser(null);
      router.push("/login");
    }
  };

  function initUserManager() {
    const COGNITO_USER_POOL_URL = `https://${runtimeConfig.public.cognitoUserPoolUrl}`;

    const cognitoAuthConfig = {
      authority: COGNITO_USER_POOL_URL,
      client_id: CLIENT_ID,
      redirect_uri: _loginRedirectUrl(),
      response_type: "code",
      scope: "email openid profile",
      extraQueryParams: {
        identity_provider: runtimeConfig.public.eiamIdentityProvider,
      },
      automaticSilentRenew: true,
      monitorSession: true,
      refreshTokenAllowedScope: "email openid profile",
      // Use localStorage to persist the user session, so that it can be shared across tabs and
      // windows. The default is sessionStorage, which only persists the session in the current tab.
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };

    // create a UserManager instance
    const userManager = new UserManager({
      ...cognitoAuthConfig,
    });

    userManager.events.addSilentRenewError((err) => {
      console.error("Silent renew error", err);
      // in case of user refresh error, we need to clear it from the store
      // and go back to the login page
      // TODO add a popup error message before going to login
      authStore.setUser(null);
      router.push("/login");
    });

    userManager.events.addUserLoaded((user: User) => {
      console.log(
        "User loaded or refreshed (token refresh)",
        user?.profile?.email,
      );
      // When the user has been loaded or updated (e.g. after a silent renew) we need to
      // update the user in the store, so that the new tokens are available for API calls
      authStore.setUser(user);
    });

    userManager.events.addUserUnloaded(() => {
      console.log("User unloaded loaded");
    });

    userManager.events.addUserSessionChanged(() => {
      console.log("User session changed");
    });

    return userManager;
  }

  /**
   * If the URL starts with pr-[number].control... then we strip away the first
   * part of the domain
   */
  function _stripPrPrefix(origin: URL): string {
    if (origin.hostname.startsWith("pr-")) {
      // If we're on a preview branch, then the URL starts with pr-[number].control...
      // Since we can't add wildcards to the list of cognito callbacks, we have to do a
      // little trick here: we remove the pr-[number] part and use control... as callback URL.
      // We then pass the pr-prefix to the state parameter, which will be passed to the
      // auth callback. The Cloudfront function will pick this up and do the magic to
      // get back to the correct PR
      return origin.hostname.split(".").slice(1).join(".");
    }
    return origin.hostname;
  }

  /**
   * Generate the callback URL by adding the callback path
   * to the current origin
   */
  function _loginRedirectUrl(): string {
    if (!window?.location) {
      return "";
    }
    const origin = new URL(window.location.origin);
    origin.hostname = _stripPrPrefix(origin);

    const callbackRoute = router
      .getRoutes()
      .find((route) => route.name == "auth-login-callback");

    if (!callbackRoute) {
      throw new Error("No callback route found");
    }

    origin.pathname = callbackRoute.path;

    return origin.toString();
  }

  /**
   * If we're on a preview branch, the URL starts with pr-[number].control...
   * We pass this subdomain to the state parameter of the oidc round-trip
   * for the cloudfront function to extract and use it for proper routing
   */
  function _getStateParam(): string | undefined {
    if (!window?.location) {
      return undefined;
    }
    const origin = new URL(window.location.origin);

    if (origin.hostname.startsWith("pr-")) {
      return origin.hostname.split(".")[0] as string;
    }
    return undefined;
  }

  /**
   * Go to the login page
   */
  async function goToLogin() {
    return await authStore.userManager.signinRedirect({
      url_state: _getStateParam(),
    });
  }

  /**
   * The auth logout workflow works like this:
   * call to COGNITO -> redirect to EIAM -> redirect to PORTAL
   * This way, we're being logged out from COGNITO as well as EIAM
   *
   * So we provide the eIam logout url to cognito by assembling it here
   */
  function _getLogoutUri(): string {
    const origin = new URL(window.location.origin);
    origin.hostname = _stripPrPrefix(origin);
    const redirectUrl = origin.toString();

    const eiamUrl = runtimeConfig.public.eiamLogoutUrl;

    const query: URLSearchParams = new URLSearchParams({
      post_logout_redirect_uri: redirectUrl,
      ...(_getStateParam() && { state: _getStateParam() }),
    });
    const logoutUri = `${eiamUrl}?${query.toString()}`;

    return logoutUri;
  }

  /**
   * Logout the user
   *
   * Pass in logout_uri of eIam. See _getLogoutUri
   */
  function logout() {
    // Inform other tabs that the use has logged out
    channel.postMessage(CHANNEL_MESSAGE_LOGOUT);
    return authStore.userManager.signoutRedirect({
      extraQueryParams: {
        client_id: CLIENT_ID,
        logout_uri: _getLogoutUri(),
      },
    });
  }

  /**
   * Exchanges the auth code for JWT tokens
   */
  async function exchangeCodeForAccessTokens() {
    const res = await authStore.userManager.signinCallback();

    if (
      !res?.access_token ||
      !res?.refresh_token ||
      !res?.profile["cognito:username"]
    ) {
      throw new Error("Data missing");
    }

    return true;
  }

  /**
   * Remove the user from the storage
   *
   * This is only used as a fallback for when the logout round trip fails.
   * The logout procedure removes the user itself
   */
  async function removeUser() {
    await authStore.userManager.removeUser();
  }

  return {
    initUserManager,
    goToLogin,
    logout,
    exchangeCodeForAccessTokens,
    removeUser,
  };
}
