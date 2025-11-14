import { UserManager, Log } from "oidc-client-ts";

export enum LOGIN_MODE {
  END_USER = "end_user",
  M2M = "m2m",
}

/**
 *
 * @returns
 */
export default function useCognitoApi() {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();

  Log.setLogger(console);

  const CLIENT_IDS: {
    -readonly [key in LOGIN_MODE]: string;
  } = {
    [LOGIN_MODE.END_USER]: runtimeConfig.public.end_user_client_id,
    [LOGIN_MODE.M2M]: runtimeConfig.public.m2m_user_client_id,
  };

  function initUserManager() {
    const COGNITO_USER_POOL_URL = runtimeConfig.public.cognito_user_pool_url;

    const COGNITO_URL = `https://${runtimeConfig.public.cognito_domain}`;
    const COGNITO_CF_PROXY = `https://${runtimeConfig.public.cognito_cf_proxy_domain}`;

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
   * Generate the callback URL by adding the callback path
   * to the current origin
   */
  function _loginRedirectUrl(): string {
    if (!window?.location) {
      return "";
    }
    const origin = new URL(window.location.origin);

    if (origin.hostname.startsWith("pr-")) {
      // If we're on a preview branch, then the URL starts with pr-[number].control...
      // Since we can't add wildcards to the list of cognito callbacks, we have to do a
      // little trick here: we remove the pr-[number] part and use control... as callback URL.
      // We then pass the pr-prefix to the state parameter, which will be passed to the
      // auth callback. The Cloudfront function will pick this up and do the magic to
      // get back to the correct PR
      origin.hostname = origin.hostname.split(".").slice(1).join(".");
    }

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

  function revokeTokens() {
    return authStore.userManager.revokeTokens(["refresh_token"]);
  }

  // function getLogoutUri(): string {
  //   let logoutUri: string = `${window.location.origin}/login`;
  //   const eiamHost: string =
  //     "eiam-simulation.auth.eu-central-1.amazoncognito.com";
  //   const eiamClientId: string = "1acj684gajv0q09prbu7ut7ihh";

  //   const query: URLSearchParams = new URLSearchParams({
  //     client_id: eiamClientId,
  //     logout_uri: logoutUri,
  //   });
  //   logoutUri = `https://${eiamHost}/logout?${query.toString()}`;

  //   return logoutUri;
  // }

  /**
   * Logout the user
   */
  function logout(/*logoutUri: string*/) {
    return authStore.userManager.signoutRedirect({
      extraQueryParams: {
        // logout_uri: getLogoutUri(),
        client_id: CLIENT_IDS[LOGIN_MODE.END_USER],
      },
    });
  }

  // async function refreshToken() {
  //     if (!authStore.refreshToken || !authStore.loginMode) {
  //         throw new Error(
  //             "Cannot refresh token without username, refreshToken and loginMode. They're missing in the store"
  //         )
  //     }

  //     const res = await cognito.refresh(authStore.refreshToken, authStore.loginMode)
  //     if (res.status !== 200 || !res.data?.access_token) {
  //         throw new Error("Refresh call didn't respond a access_token")
  //     }
  //     authStore.setAccessToken(res.data.access_token)

  //     return true
  // }

  async function exchangeCodeForAccessTokens() {
    const res = await authStore.userManager.signinCallback();

    if (
      !res?.access_token ||
      !res?.refresh_token ||
      !res?.profile["cognito:username"]
    ) {
      throw new Error("Data missing");
    }

    // authStore.setAccessToken(res?.access_token);
    // authStore.setRefreshToken(res?.refresh_token);

    // Get the IDP provider name based on the group claim, when the login via an external IDP
    // cognito adds automatically the user to the group [user pool ID]_[IdP name], see
    // https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-federation.html
    // const groups: string[] = (profile['cognito:groups'] as string[]) || []
    // authStore.setProviderName(auth.getProviderNameFromGroups(groups))

    return true;
  }

  return {
    initUserManager,
    goToLogin,
    revokeTokens,
    // refreshToken,
    logout,
    exchangeCodeForAccessTokens,
  };
}
