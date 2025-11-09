import * as allure from "allure-js-commons";
import { expect, test } from "../fixtures/fixtures";
import { InventoryPage } from "../pages/inventory/inventory.page";
import { LoginPage } from "../pages/login/login.page";

const inventoryUrl = InventoryPage.URL;


test.describe("Logout", () => {
  test(`From the inventory page`, async ({ inventoryPage, baseURL, page }) => {

    await allure.step(`Select hamburger menu > Logout`, async () => {
      await inventoryPage.logout();
    });

    await allure.step(`Check if the page is not in ${inventoryUrl}`, async () => {
      expect(inventoryPage.page.url()).not.toContain(inventoryUrl);
      expect(inventoryPage.page.url()).toContain(baseURL!);
    });

    await allure.step(`Check if the page is shows the login fields`, async () => {
      const loginPage: LoginPage = new LoginPage(page);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

  });
});