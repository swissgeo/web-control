const toast = useToast();

const MIN_TOAST_DURATION = 2000; // 2 seconds
const MAX_TOAST_DURATION = 7000; // 7 seconds

export function toastError(description: string) {
  toast.add({
    title: "Error",
    description: description,
    progress: false,
    color: "error",
    duration: 0, // Keep toast until user dismisses it.
  });
}

export function toastSuccess(description: string) {
  toast.add({
    title: "Success",
    description: description,
    progress: true,
    color: "success",
    duration: displayDuration(description),
  });
}

export function toastInfo(description: string) {
  toast.add({
    title: "Info",
    description: description,
    progress: true,
    color: "info",
    duration: displayDuration(description),
  });
}

// displayDuration calculates how long a message should be displayed based on
// number of characters (50ms per character) with lower and upper bounds.
const displayDuration = (message: string) => {
  return Math.min(
    Math.max(message.length * 50, MIN_TOAST_DURATION),
    MAX_TOAST_DURATION,
  );
};
