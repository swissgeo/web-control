import { test, expect } from "@playwright/test";

test("Login page", async ({ page }) => {
  await page.goto("http://localhost:3042");
  await expect(page).toHaveTitle(/Swissgeo control/);
});
