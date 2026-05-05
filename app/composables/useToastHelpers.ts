export const useToastHelpers = () => {
  const toast = useToast();
  const { t } = useI18n();

  const MIN_TOAST_DURATION = 2000; // ms
  const MAX_TOAST_DURATION = 7000; // ms

  // displayDuration calculates how long a message should be displayed based on
  // number of characters (50ms per character) with lower and upper bounds.
  const displayDuration = (message: string) => {
    return Math.min(
      Math.max(message.length * 50, MIN_TOAST_DURATION),
      MAX_TOAST_DURATION,
    );
  };

  const toastError = (description: string) => {
    toast.add({
      title: t("common.error"),
      description,
      progress: false,
      color: "error",
      duration: 0, // Keep toast until user dismisses it.
    });
  };

  const toastSuccess = (description: string) => {
    toast.add({
      title: t("common.success"),
      description,
      progress: true,
      color: "success",
      duration: displayDuration(description),
    });
  };

  const toastInfo = (description: string) => {
    toast.add({
      title: t("common.info"),
      description,
      progress: true,
      color: "info",
      duration: displayDuration(description),
    });
  };

  return { toastError, toastSuccess, toastInfo };
};
