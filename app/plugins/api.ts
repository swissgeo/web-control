export default defineNuxtPlugin(() => {
  const {
    public: { serviceControlBase: controlAPIBase, environment: environment },
  } = useRuntimeConfig();
  const authStore = useAuthStore();

  const controlAPI = $fetch.create({
    baseURL: controlAPIBase,
    onRequest({ options }) {
      const token = authStore.accessToken;

      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);

        if (environment === "local") {
          headers.set("X-Auth-Request-User", "superuser");
          headers.set("X-Auth-Request-Preferred-Username", "superuser");
          headers.set("X-Auth-Request-Email", "superuser@example.com");
          headers.set("X-Auth-Request-Groups", "swissgeo-admin");
        }

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
