import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe, vi, afterEach } from "vitest";
import Units from "@/pages/admin/units.vue";

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

describe("Units Page", () => {
  vi.mock("@/api/units");
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Renders Component", async () => {
    const component = await mountSuspended(Units);
    expect(component.exists()).toBe(true);
  });

  it("Has header 1", async () => {
    const component = await mountSuspended(Units);
    expect(component.find("h1").exists()).toBe(true);
  });

  it("displays data table", async () => {
    const component = await mountSuspended(Units);
    expect(component.find("table").exists()).toBe(true);
    expect(component.findAll("td")[0].text()).toContain("mock-unit-id");
    expect(component.findAll("td")[1].text()).toContain("Mock Unit");
  });

  it("shows toast if not loaded", async () => {
    const { useUnitsApi } = await import("@/api/units");
    useUnitsApi().getUnits.mockRejectedValueOnce(new Error("Failed to load"));
    await mountSuspended(Units);
    expect(toastErrorMock).toHaveBeenCalledWith("common.loadError");
  });

  it("shows edit button", async () => {
    const component = await mountSuspended(Units);
    // console.log(component.html());

    const row = component
      .findAll("tbody tr")
      .find((r) => r.text().includes("mock-unit-id"));
    expect(row?.exists()).toBeTruthy();

    const actionCell = row!.findAll("td").at(-1)!;
    const button = actionCell.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("common.edit");
  });
});
