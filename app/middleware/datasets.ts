export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  if (!authStore.canManageDatasets) {
    return navigateTo("/");
  }
});
