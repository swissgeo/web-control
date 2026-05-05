import type { RouteLocationNormalizedGeneric } from "vue-router";

const LOGIN_ROUTES = ["login", "auth-login-callback"];
const ACCESS_REQUEST_ROUTES = ["accessRequest"];

export default defineNuxtRouteMiddleware(
  async (
    to: RouteLocationNormalizedGeneric /*,
    from: RouteLocationNormalizedGeneric,*/,
  ) => {
    const authStore = useAuthStore();

    if (!authStore.isLoggedIn) {
      if (LOGIN_ROUTES.includes(to.name as string)) {
        // If the user is not logged in and is going to a login-related page, just return to avoid infinite
        // redirect loop.
        return;
      }
      return navigateTo("/login");
    }

    // If the user is logged in and is going to a login-related page, redirect to the home page
    if (authStore.isLoggedIn && LOGIN_ROUTES.includes(to.name as string)) {
      return navigateTo("/");
    }

    // If user is going to logout or profile page, allow it without organization check,
    // as even users without organization should be able to access these pages.
    if (["auth-logout", "profile"].includes(to.name as string)) {
      return;
    }

    // If user has no organization, redirect to access request page.
    if (
      authStore.organizationId == "" &&
      !ACCESS_REQUEST_ROUTES.includes(to.name as string)
    ) {
      return navigateTo("/accessRequest");
    }
    // If user has an organization and is going to access request page, redirect to the home page
    if (
      authStore.organizationId != "" &&
      ACCESS_REQUEST_ROUTES.includes(to.name as string)
    ) {
      return navigateTo("/");
    }
  },
);
