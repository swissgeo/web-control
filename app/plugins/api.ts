export default defineNuxtPlugin(() => {
  const {
    public: { serviceControlBase: controlAPIBase },
  } = useRuntimeConfig();
  const authStore = useAuthStore();

  const controlAPI = $fetch.create({
    baseURL: controlAPIBase,
    onRequest({ options }) {
      const token = authStore.accessToken;

      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        options.headers = headers;
      }
    },
  });

  return {
    provide: {
      controlAPI,
    },
  };
});
