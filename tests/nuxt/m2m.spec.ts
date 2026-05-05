import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe, vi, afterEach } from "vitest";
import M2M from "@/pages/admin/m2m.vue";

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

describe("M2M Page", () => {
  vi.mock("@/api/machineUsers");
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Renders Component", async () => {
    const component = await mountSuspended(M2M);
    expect(component.exists()).toBe(true);
  });

  it("Has header 1", async () => {
    const component = await mountSuspended(M2M);
    expect(component.find("h1").exists()).toBe(true);
  });

  it("displays data table", async () => {
    const component = await mountSuspended(M2M);
    expect(component.find("table").exists()).toBe(true);
    expect(component.findAll("td")[0].text()).toContain("mock_client_id");
  });

  it("shows toast if not loaded", async () => {
    const { useMachineUsersApi } = await import("@/api/machineUsers");
    useMachineUsersApi().getMachineUsers.mockRejectedValueOnce(
      new Error("Failed to load"),
    );
    await mountSuspended(M2M);
    expect(toastErrorMock).toHaveBeenCalledWith("common.loadError");
  });

  it("shows create button", async () => {
    const component = await mountSuspended(M2M);
    expect(component.find("button").text()).toContain("machineUser.create");
  });

  it("shows delete button", async () => {
    const component = await mountSuspended(M2M);
    // console.log(component.html());

    const row = component
      .findAll("tbody tr")
      .find((r) => r.text().includes("mock_client_id"));
    expect(row?.exists()).toBeTruthy();

    const actionCell = row!.findAll("td").at(-1)!;
    const button = actionCell.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("common.delete");
  });
});
