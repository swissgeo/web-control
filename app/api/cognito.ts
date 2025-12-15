import { UserManager, Log } from "oidc-client-ts";

export enum LOGIN_MODE {
  END_USER = "end_user",
  M2M = "m2m",
}

/**
 * API to the cognito endpoint using oidc client
 */
export default function useCognitoApi() {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();

  Log.setLogger(console);

  const CLIENT_IDS: {
    -readonly [key in LOGIN_MODE]: string;
  } = {
    [LOGIN_MODE.END_USER]: runtimeConfig.public.endUserClientId,
    [LOGIN_MODE.M2M]: runtimeConfig.public.m2mUserClientId,
  };

  function initUserManager() {
    const COGNITO_USER_POOL_URL = runtimeConfig.public.cognitoUserPoolUrl;

    const COGNITO_URL = `https://${runtimeConfig.public.cognitoDomain}`;
    const COGNITO_CF_PROXY = `https://${runtimeConfig.public.cognitoCfProxyDomain}`;

    const cognitoAuthConfig = {
      authority: COGNITO_URL,
      // Here it is important to provide the full metadata in order to avoid
      // oidc auto discovery which won't work with our CF proxy.
      // Some endpoints needs to go through the proxy to add the secrets while other
      // not. It is also important to have the cognito logout working to use the oauth2/authorize
      // endpoint using the correct cognito endpoint without proxy because it will redirect to the
      // Managed login and set a cognito session cookie locked domain that needs to be set to the
      // logout endpoint at the same domain.
      metadata: {
        // Direct cognito endpoints
        issuer: COGNITO_USER_POOL_URL,
        authorization_endpoint: `${COGNITO_URL}/oauth2/authorize`,
        end_session_endpoint: `${COGNITO_URL}/logout`,
        jwks_uri: `https://${COGNITO_USER_POOL_URL}/.well-known/jwks.json`,
        // CF proxy endpoints adding client secrets
        token_endpoint: `${COGNITO_CF_PROXY}/oauth2/token`,
        userinfo_endpoint: `${COGNITO_CF_PROXY}/oauth2/userinfo`,
        revocation_endpoint: `${COGNITO_CF_PROXY}/oauth2/revoke`,
      },
      client_id: CLIENT_IDS[LOGIN_MODE.END_USER],
      redirect_uri: _loginRedirectUrl(),
      response_type: "code",
      scope: "email openid profile",
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
      .find((route) => route.name == "auth-callback");

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
    return authStore.userManager.signoutRedirect({
      extraQueryParams: {
        client_id: CLIENT_IDS[LOGIN_MODE.END_USER],
        logout_uri: _getLogoutUri(),
      },
      url_state: _getStateParam(),
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
  function removeUser() {
    authStore.userManager.removeUser();
  }

  return {
    initUserManager,
    goToLogin,
    logout,
    exchangeCodeForAccessTokens,
    removeUser,
  };
}
