// import { useLocalStorage } from '@vueuse/core'

import type { User, UserManager } from "oidc-client-ts";
import useCognitoApi from "~/api/cognito";

export const useAuthStore = defineStore("auth", () => {
  // #region: state
  const _userManager = ref<UserManager>();
  const _userCache = ref<User>();
  const loginUrl = ref<string>();
  // #endregion

  // #region: helpers

  /*
   * getUser is a promise, so if we don't have the data yet
   * we dispatch the call and in the meantime return empty values
   * so that further down the chain we don't have to handle promises
   */
  const _getUserToCache = () => {
    if (!_userCache.value) {
      userManager.value?.getUser().then((user) => {
        if (user) {
          _userCache.value = user;
        }
      });
    }
  };
  // #endregion

  // #region: getters
  const userManager = computed(() => {
    if (!_userManager.value) {
      const cognitoApi = useCognitoApi();
      _userManager.value = cognitoApi.initUserManager();
    }

    return _userManager.value;
  });

  /**
   * Determine if logged in by getting the user
   */
  const isLoggedIn = computed(() => {
    _getUserToCache();
    return !!_userCache.value;
  });

  /**
   * Determine if logged in by getting the user.
   * Synced method, this will return a promise
   */
  const isLoggedInSync = computed(async () => {
    return !!(await userManager.value.getUser());
  });

  /**
   * Get the user Profile
   */
  const profile = computed(() => {
    _getUserToCache();
    return (
      _userCache.value?.profile || {
        given_name: "",
        family_name: "",
      }
    );
  });

  // used for debugging, I don't think we should really use this
  // otherwise
  const accessData = computed(() => {
    _getUserToCache();
    return _userCache.value;
  });

  // #endregion

  // #region: actions

  // function setupAccessTokenRefresh() {
  //     if (!refreshInterval.value && refreshToken.value && accessToken.value) {
  //         const lifetime = getAccessTokenLifetime(accessToken.value)
  //         if (lifetime > 0) {
  //             refreshInterval.value = setInterval(
  //                 () => auth.refreshToken(),
  //                 // Refresh the access token every one minute before it expires
  //                 (lifetime - 60) * 1000
  //             )
  //         } else {
  //             // eslint-disable-next-line no-console
  //             console.error('Access token lifetime is not valid, cannot set up refresh interval')
  //         }
  //     } else if (refreshInterval.value && !refreshToken.value) {
  //         // refresh token has been cleared, so we clear the interval
  //         clearInterval(refreshInterval.value)
  //         refreshInterval.value = null
  //     }
  // }

  // function getAccessTokenLifetime(token: string): number {
  //     const payload = JSON.parse(atob(token.split('.')[1] || ''))
  //     if (!payload || !payload.exp || !payload.iat) {
  //         return -1
  //     }
  //     return payload.exp - payload.iat
  // }

  function setLoginUrl(url: string) {
    loginUrl.value = url;
  }

  function $reset() {
    _userManager.value = undefined;
  }

  // #endregion

  return {
    // state
    loginUrl,
    // computed
    userManager,
    accessData,
    isLoggedIn,
    isLoggedInSync,
    profile,
    // actions
    setLoginUrl,
    $reset,
  };
});
