// import { useLocalStorage } from '@vueuse/core'

import type { User, UserManager } from "oidc-client-ts";
import useCognitoApi from "~/api/cognito";

export const useAuthStore = defineStore("auth", () => {
  // #region: state
  // The cached user manager
  const _userManager = ref<UserManager>();
  // The cached user, so we don't have to use a promise every time
  const _userCache = ref<User>();
  // The URL to redirect to after login
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
  /**
   * Initialize and return the userManager if it doesn't exist yet
   */
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

  /**
   * Return the access token. To be used for authorized calls
   */
  const accessToken = computed(() => {
    _getUserToCache();
    return _userCache.value?.access_token;
  });

  // #endregion

  // #region: actions
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
    accessToken,
    // actions
    setLoginUrl,
    $reset,
  };
});
