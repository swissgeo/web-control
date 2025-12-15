import type { RouteLocationNormalizedGeneric } from "vue-router";

const PUBLIC_ROUTES = ["login", "auth-callback", "auth-logout"];

export default defineNuxtRouteMiddleware(
  async (
    to: RouteLocationNormalizedGeneric /*,
    from: RouteLocationNormalizedGeneric,*/,
  ) => {
    const authStore = useAuthStore();

    if (!to.name?.toString()) {
      return navigateTo("/login");
    }

    if (PUBLIC_ROUTES.includes(to.name?.toString())) {
      return;
    }

    const isLoggedIn = await authStore.isLoggedInSync;

    if (isLoggedIn) {
      return;
    }

    // the fallback should always be go to login
    authStore.setLoginUrl(to.path);
    return navigateTo("/login");
  },
);
