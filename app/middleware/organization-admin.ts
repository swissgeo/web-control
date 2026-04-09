export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  if (!authStore.canManageOrganization) {
    return navigateTo("/");
  }
});
