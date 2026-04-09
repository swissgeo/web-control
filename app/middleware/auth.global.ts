import type { RouteLocationNormalizedGeneric } from "vue-router";

const LOGIN_ROUTES = ["login", "auth-login-callback"];
const ACCESS_REQUEST_ROUTES = ["accessRequest"];
const ORGANIZATION_ADMIN_ROUTE = "admin";
const DATASET_ROUTE = "datasets";

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
    if (!authStore.isLoggedIn) {
      // If we reach this, the user is going to a login route, so just return to avoid infinite
      // redirect loop.
      return;
    }

    // Always allowed routes (if is logged in)
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
    // If user has an organization, no longer needs to go to access request page.
    if (
      authStore.organizationId != "" &&
      ACCESS_REQUEST_ROUTES.includes(to.name as string)
    ) {
      return navigateTo("/");
    }

    if (
      (to.name as string).startsWith(ORGANIZATION_ADMIN_ROUTE) &&
      !authStore.canManageOrganization
    ) {
      return navigateTo("/");
    }
    if (
      (to.name as string).startsWith(DATASET_ROUTE) &&
      !authStore.canManageDatasets
    ) {
      return navigateTo("/");
    }
  },
);
