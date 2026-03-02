import { test, expect } from "@playwright/test";

test("Login page", async ({ page }) => {
  await page.goto("http://localhost:3042");
  await expect(page).toHaveTitle(/SWISSGEO control/);
});

test("Language switcher", async ({ page }) => {
  await page.goto("http://localhost:3042");

  const name_en = "Home";
  const name_de = "Startseite";
  const name_fr = "Accueil";

  await expect(page.getByRole("heading", { name: name_en })).toBeVisible();
  await expect(page.getByRole("heading", { name: name_de })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: name_fr })).not.toBeVisible();

  await page.getByRole("link", { name: "de" }).click();
  await expect(page.getByRole("heading", { name: name_en })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: name_de })).toBeVisible();
  await expect(page.getByRole("heading", { name: name_fr })).not.toBeVisible();

  await page.getByRole("link", { name: "fr" }).click();
  await expect(page.getByRole("heading", { name: name_en })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: name_de })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: name_fr })).toBeVisible();
});
