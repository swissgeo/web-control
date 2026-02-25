import type { RouteLocationNormalizedGeneric } from "vue-router";

const LOGIN_ROUTES = ["login", "auth-login-callback"];

export default defineNuxtRouteMiddleware(
  async (
    to: RouteLocationNormalizedGeneric /*,
    from: RouteLocationNormalizedGeneric,*/,
  ) => {
    const authStore = useAuthStore();

    // If the user is not logged in and is not going to a login-related page, redirect to the login page
    if (!authStore.isLoggedIn && !LOGIN_ROUTES.includes(to.name as string)) {
      authStore.setLoginUrl(to.path);
      return navigateTo("/login");
    }

    if (authStore.isLoggedIn && LOGIN_ROUTES.includes(to.name as string)) {
      return navigateTo("/");
    }
  },
);
