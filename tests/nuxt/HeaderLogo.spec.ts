import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe } from "vitest";
import HeaderLogo from "~/components/HeaderLogo.vue";

describe("HeaderLogo", () => {
  it("displays collapsed logo", async () => {
    const collapsed = true;
    const component = await mountSuspended(HeaderLogo, {
      props: { collapsed },
    });
    expect(
      component.find('[data-testid="header-logo-collapsed"]').exists(),
    ).toBe(true);
    expect(component.find('[data-testid="header-logo"]').exists()).toBe(false);
  });

  it("displays expanded logo", async () => {
    const collapsed = false;
    const component = await mountSuspended(HeaderLogo, {
      props: { collapsed },
    });
    expect(component.find('[data-testid="header-logo"]').exists()).toBe(true);
    expect(
      component.find('[data-testid="header-logo-collapsed"]').exists(),
    ).toBe(false);
  });

  it("matches collapsed snapshop", async () => {
    const collapsed = true;
    const component = await mountSuspended(HeaderLogo, {
      props: { collapsed },
    });
    expect(component.html()).toMatchSnapshot();
  });

  it("matches expanded snapshop", async () => {
    const collapsed = false;
    const component = await mountSuspended(HeaderLogo, {
      props: { collapsed },
    });
    expect(component.html()).toMatchSnapshot();
  });
});
