// import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore("auth", () => {
  // const refreshInterval: Ref<null | ReturnType<typeof setTimeout>> = ref(null)

  // const accessToken: Ref<string | null> = useLocalStorage('accessToken', null)
  // const refreshToken: Ref<string | null> = useLocalStorage('refreshToken', null)
  // const username: Ref<string | null> = useLocalStorage('username', null)

  const accessToken = ref<string>();
  const refreshToken = ref<string>();
  const username = ref<string>();

  function setAccessToken(token: string) {
    accessToken.value = token;
    // setupAccessTokenRefresh()
  }

  function setRefreshToken(token: string) {
    refreshToken.value = token;
    // setupAccessTokenRefresh()
  }

  function setUsername(_username: string) {
    username.value = _username;
  }

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

  return {
    accessToken,
    refreshToken,
    username,
    setAccessToken,
    setRefreshToken,
    setUsername,
  };
});
