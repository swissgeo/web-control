export const useDateTimeFormat = () => {
  const { locale } = useI18n();

  function formatDateTime(
    value: string | Date,
    options?: Intl.DateTimeFormatOptions,
  ) {
    return new Intl.DateTimeFormat(locale.value, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      ...options,
    }).format(new Date(value));
  }

  return {
    formatDateTime,
  };
};
