import { UserManager } from "oidc-client-ts";

export enum LOGIN_MODE {
  END_USER = "end_user",
  M2M = "m2m",
}

export default function useCognitoApi() {
  const runtimeConfig = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();

  const CLIENT_IDS: {
    -readonly [key in LOGIN_MODE]: string;
  } = {
    [LOGIN_MODE.END_USER]: runtimeConfig.public.end_user_client_id,
    [LOGIN_MODE.M2M]: runtimeConfig.public.m2m_user_client_id,
  };

  function loginRedirectUrl(): string {
    // const url = new URL(window.location.origin)
    return "https://control.dev.sgdi.tech/auth/callback";
  }

  const COGNITO_USER_POOL_URL =
    "cognito-idp.eu-central-1.amazonaws.com/eu-central-1_vThzpBvP8/";
  const COGNITO_URL = "https://auth.dev.sgdi.tech";
  const COGNITO_CF_PROXY = "https://auth.dev.sgdi.tech";

  console.log(CLIENT_IDS[LOGIN_MODE.END_USER]);

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
    redirect_uri: loginRedirectUrl(),
    response_type: "code",
    scope: "email openid profile",
  };

  // create a UserManager instance
  const userManager = new UserManager({
    ...cognitoAuthConfig,
  });

  async function goToLogin() {
    console.log("go to login");
    return await userManager.signinRedirect();
  }

  function revokeTokens() {
    return userManager.revokeTokens(["refresh_token"]);
  }

  function logout(logoutUri: string) {
    return userManager.signoutRedirect({
      extraQueryParams: {
        logout_uri: logoutUri,
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
    const res = await userManager.signinCallback();

    if (
      !res?.access_token ||
      !res?.refresh_token ||
      !res?.profile["cognito:username"]
    ) {
      throw new Error("Data missing");
    }

    const profile = res?.profile || {};
    const userName: string | null =
      (profile["preferred_username"] as string) ||
      (profile["cognito:username"] as string) ||
      null;

    authStore.setAccessToken(res?.access_token);
    authStore.setRefreshToken(res?.refresh_token);
    if (userName) {
      authStore.setUsername(userName);
    }

    // Get the IDP provider name based on the group claim, when the login via an external IDP
    // cognito adds automatically the user to the group [user pool ID]_[IdP name], see
    // https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-federation.html
    // const groups: string[] = (profile['cognito:groups'] as string[]) || []
    // authStore.setProviderName(auth.getProviderNameFromGroups(groups))

    router.push("/");
  }

  return {
    goToLogin,
    revokeTokens,
    // refreshToken,
    logout,
    exchangeCodeForAccessTokens,
  };
}
