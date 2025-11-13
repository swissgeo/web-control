import type { RouteLocationNormalizedGeneric } from "vue-router";

const PUBLIC_ROUTES = ["login", "auth-callback", "auth-logout"];

export default defineNuxtRouteMiddleware(
  (
    to: RouteLocationNormalizedGeneric /*,
    from: RouteLocationNormalizedGeneric,*/,
  ) => {
    const authStore = useAuthStore();
    const isAuthenticated = () => authStore.isLoggedIn;

    if (!to.name?.toString()) {
      return navigateTo("/login");
    }

    if (PUBLIC_ROUTES.includes(to.name?.toString())) {
      return;
    }

    if (isAuthenticated() === false) {
      return navigateTo("/login");
    }
  },
);
