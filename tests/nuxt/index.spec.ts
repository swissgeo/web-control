import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe, vi, afterEach } from "vitest";
import Organization from "@/pages/admin/index.vue";

const toastErrorMock = vi.fn();

vi.mock("@/composables/useToastHelpers", () => ({
  useToastHelpers: () => ({
    toastError: toastErrorMock,
  }),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/api/organization");

describe("Admin index Page", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Renders Component", async () => {
    const component = await mountSuspended(Organization);
    expect(component.exists()).toBe(true);
  });

  it("Has header 1", async () => {
    const component = await mountSuspended(Organization);
    expect(component.find("h1").exists()).toBe(true);
  });

  it("shows toast if not loaded", async () => {
    const { useOrganizationApi } = await import("@/api/organization");
    // @ts-expect-error The mocking replaces the implementation and TS can't see that
    useOrganizationApi().getOrganization.mockRejectedValueOnce(
      new Error("Failed to load"),
    );
    await mountSuspended(Organization);
    expect(toastErrorMock).toHaveBeenCalledWith("common.loadError");
  });
});
