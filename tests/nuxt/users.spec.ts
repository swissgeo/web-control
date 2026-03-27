import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe, vi, afterEach } from "vitest";
import Users from "@/pages/admin/users.vue";

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

describe("Users Page", () => {
  vi.mock("@/api/users");
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Renders Component", async () => {
    const component = await mountSuspended(Users);
    expect(component.exists()).toBe(true);
  });

  it("Has header 1", async () => {
    const component = await mountSuspended(Users);
    expect(component.find("h1").exists()).toBe(true);
  });

  it("displays data table", async () => {
    const component = await mountSuspended(Users);
    expect(component.find("table").exists()).toBe(true);
    expect(component.findAll("td")[0].text()).toContain("Mock");
    expect(component.findAll("td")[1].text()).toContain("User");
    expect(component.findAll("td")[2].text()).toContain(
      "mock-user@example.com",
    );
    expect(component.findAll("td")[3].text()).toContain("mock-unit");
    expect(component.findAll("td")[4].text()).toContain("Organization Admin");
  });

  it("shows toast if not loaded", async () => {
    const { useUsersApi } = await import("@/api/users");
    useUsersApi().getUsers.mockRejectedValueOnce(new Error("Failed to load"));
    await mountSuspended(Users);
    expect(toastErrorMock).toHaveBeenCalledWith("common.loadError");
  });

  it("shows edit button", async () => {
    const component = await mountSuspended(Users);
    // console.log(component.html());

    const row = component
      .findAll("tbody tr")
      .find((r) => r.text().includes("Mock"));
    expect(row?.exists()).toBeTruthy();

    const actionCell = row!.findAll("td").at(-1)!;
    const button = actionCell.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("common.edit");
  });
});
