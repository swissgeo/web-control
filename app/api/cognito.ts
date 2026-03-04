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
  const router = useRouter();

  // Setup oidc-client-ts library logger
  Log.setLogger(console);

  const CLIENT_ID = runtimeConfig.public.cognitoAppClientId;

  // Initialize the UserManager instance from oidc-client-ts, which will handle the OIDC flow with Cognito
  const userManager = _initUserManager();

  /**
   * Initialize the OIDC User manager
   */
  function _initUserManager(): UserManager {
    const COGNITO_USER_POOL_URL = `https://${runtimeConfig.public.cognitoUserPoolUrl}`;
    const SCOPES = "email openid profile";

    const cognitoAuthConfig = {
      authority: COGNITO_USER_POOL_URL,
      client_id: CLIENT_ID,
      redirect_uri: _loginRedirectUrl(),
      response_type: "code",
      scope: SCOPES,
      extraQueryParams: {
        identity_provider: runtimeConfig.public.eiamIdentityProvider,
      },
      metadataSeed: {
        // We use the eIAM logout endpoint for logout
        end_session_endpoint: runtimeConfig.public.eiamLogoutUrl,
      },
      automaticSilentRenew: true,
      monitorSession: true,
      refreshTokenAllowedScope: SCOPES,
      // Use localStorage to persist the user session, so that it can be shared across tabs and
      // windows. The default is sessionStorage, which only persists the session in the current tab.
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };

    // create a UserManager instance
    const userManager = new UserManager({
      ...cognitoAuthConfig,
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
   * Prepare the Cognito logout URL with its query parameters.
   *
   * The auth logout workflow works like this:
   *  -> eIAM Logout -> redirect to Cognito logout -> redirect to PORTAL
   *
   * This way, we're being logged out from eIAM as well as Cognito.
   * eIAM only needs to register the Cognito logout endpoint and supports wildcard in the query
   * part of the logout URL. This allow us to have full control over the last redirect URL to the
   * application without having to change the eIAM integration.
   *
   * For Cognito logout endpoint specification see
   * https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html#get-logout
   */
  function _getLogoutUri(): string {
    const cognitoLogoutEndpoint = `${runtimeConfig.public.cognitoUrl}/logout`;

    const origin = new URL(window.location.origin);
    origin.hostname = _stripPrPrefix(origin);
    const postLogoutRedirectUri = origin.toString();

    const query = new URLSearchParams({
      client_id: CLIENT_ID,
      logout_uri: postLogoutRedirectUri,
      // Unfortunately, Cognito doesn't support passing the state parameter when using
      // logout_uri query parameter, it only supports sate param with redirect_uri.
      // ...(_getStateParam() ? { state: _getStateParam() } : {}),
    });
    const logoutUri = `${cognitoLogoutEndpoint}?${query.toString()}`;

    return logoutUri;
  }

  /**
   * Initialize the Cognito API by initializing the OIDC user manager and registering the user session events
   *
   * @param userEventCb A callback function that will be called when the user session changes
   *                    e.g. after silent renew or logout in another tab). The callback will receive
   *                    the new user or null if the user has been logged out or an error occurred
   *                    during silent renew
   */
  function init(userEventCb: (user: User | null) => void): void {
    // Listen to silent renew errors
    userManager.events.addSilentRenewError((err) => {
      console.error("Silent renew error", err);
      userEventCb(null);
    });

    userManager.events.addUserLoaded((user: User) => {
      console.log(
        "User loaded or refreshed (token refresh)",
        user?.profile?.email,
      );
      userEventCb(user);
    });

    userManager.events.addUserUnloaded(() => {
      console.log("User unloaded loaded");
    });

    userManager.events.addUserSessionChanged(() => {
      console.log("User session changed");
    });
  }

  /**
   * Go to the login page of OIDC provider (e.g. eIAM)
   */
  async function login(): Promise<void> {
    return await userManager.signinRedirect({
      url_state: _getStateParam(),
    });
  }

  /**
   * Logout the user
   *
   * Pass in logout_uri of Cognito. See _getLogoutUri
   */
  function logout(): Promise<void> {
    // stop access token renewal
    userManager.stopSilentRenew();
    // Trigger the eIAM logout endpoint with post_logout_redirect_uri query parameter set to
    // the Cognito logout endpoint. This will trigger the whole logout workflow described in _getLogoutUri()
    // eIAM logout endpoint is configured in _initUserManager()
    return userManager.signoutRedirect({
      post_logout_redirect_uri: _getLogoutUri(),
    });
  }

  /**
   * Exchanges the auth code for JWT tokens
   */
  async function signinCallback(): Promise<User> {
    const user = await userManager.signinCallback();

    if (!user) {
      throw new Error("No user returned from signin callback");
    }

    if (
      !user?.access_token ||
      !user?.refresh_token ||
      !user?.profile["cognito:username"]
    ) {
      throw new Error("Data missing");
    }

    // Once the user is signed in, we start the silent renew to automatically refresh the tokens
    // before they expire
    userManager.startSilentRenew();
    return user;
  }

  async function getUser(): Promise<User | null> {
    return await userManager.getUser();
  }

  /**
   * Remove the user from the storage
   *
   * This is only used as a fallback for when the logout round trip fails.
   * The logout procedure removes the user itself
   */
  async function reset(): Promise<void> {
    await userManager.removeUser();
    await userManager.clearStaleState();
  }

  return {
    init,
    login,
    logout,
    signinCallback,
    getUser,
    reset,
  };
}
