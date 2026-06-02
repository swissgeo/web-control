// useDateTimeFormat.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useDateTimeFormat } from "../../app/composables/useDateTimeFormat";

const locale = ref("en-US");

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    locale,
  }),
}));

describe("useDateTimeFormat", () => {
  beforeEach(() => {
    locale.value = "en-US";
  });

  // it("formats a Date using the default options", () => {
  //   const { formatDateTime } = useDateTimeFormat();

  //   const result = formatDateTime(new Date("2024-01-15T13:45:30Z"), {
  //     timeZone: "UTC",
  //   });

  //   expect(result).toBe("Jan 15, 2024, 01:45:30 PM");
  // });

  // it("formats a string date value", () => {
  //   const { formatDateTime } = useDateTimeFormat();

  //   const result = formatDateTime("2024-01-15T13:45:30Z", {
  //     timeZone: "UTC",
  //   });

  //   expect(result).toBe("Jan 15, 2024, 01:45:30 PM");
  // });

  it("uses the current i18n locale", () => {
    locale.value = "de-DE";

    const { formatDateTime } = useDateTimeFormat();

    const result = formatDateTime("2024-01-15T13:45:30Z", {
      timeZone: "UTC",
    });

    expect(result).toBe("15. Jan. 2024, 13:45:30");
  });

  it("allows Intl options to override defaults", () => {
    const { formatDateTime } = useDateTimeFormat();

    const result = formatDateTime("2024-01-15T13:45:30Z", {
      timeZone: "UTC",
      year: "2-digit",
      month: "long",
      hour12: false,
    });

    expect(result).toBe("January 15, 24 at 13:45:30");
  });
});
