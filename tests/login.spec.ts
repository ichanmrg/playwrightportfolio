import * as allure from "allure-js-commons";
import { LOGIN_CONSTANTS } from "../constants/login/login.constants";
import { expect, test } from "../fixtures/fixtures";
import { InventoryPage } from "../pages/inventory/inventory.page";

const validUsernames = LOGIN_CONSTANTS.VALID;
const invalidUsernames = LOGIN_CONSTANTS.INVALID;
const defaultPassword = process.env.DEFAULT_PASSWORD || "secret_sauce";
const inventoryUrl = InventoryPage.URL;

test.describe("Login using valid credentials", () => {
  test(`Using a regular user`, async ({ loginPage }) => {

    await allure.step(`Enter valid username (${validUsernames.REGULAR.USERNAME}) and default password`, async () => {
      await loginPage.login(validUsernames.REGULAR.USERNAME, defaultPassword!)
    });

    await allure.step(`Check if the page is in ${inventoryUrl}`, async () => {
      expect(loginPage.page.url()).toContain(inventoryUrl);
    });

  });

  test(`Using a performance glitched user`, async ({ loginPage }) => {

    await allure.step(`Enter valid username (${validUsernames.PERFORMANCE_GLITCH_USER.USERNAME}) and default password`, async () => {
      await loginPage.login(validUsernames.PERFORMANCE_GLITCH_USER.USERNAME, defaultPassword!)
    });

    await allure.step(`Check if the page is in ${inventoryUrl}`, async () => {
      expect(loginPage.page.url()).toContain(inventoryUrl);
    });

  });

  test(`Using a problem user with known UI issues in inventory`, async ({ loginPage }) => {

    await allure.step(`Enter valid username (${validUsernames.PROBLEM_USER.USERNAME}) and default password`, async () => {
      await loginPage.login(validUsernames.PROBLEM_USER.USERNAME, defaultPassword!)
    });

    await allure.step(`Check if the page is in ${inventoryUrl}`, async () => {
      expect(loginPage.page.url()).toContain(inventoryUrl);
    });

  });
});

test.describe("Login using invalid credentials", () => {
  test(`Using a locked-out user`, async ({ loginPage }) => {

    await allure.step(`Enter invalid username (${invalidUsernames.LOCKED_OUT_USER.USERNAME}) and default password`, async () => {
      await loginPage.login(invalidUsernames.LOCKED_OUT_USER.USERNAME, defaultPassword!);
    });

    await allure.step(`Check if locked-out error is displayed.`, async () => {
      await expect(loginPage.lockedOutError).toBeVisible();
    });

  });

  test(`Using blank username`, async ({ loginPage }) => {

    await allure.step(`Enter invalid username (blank) and default password`, async () => {
      await loginPage.login("", defaultPassword!);
    });

    await allure.step(`Check if locked-out error is displayed.`, async () => {
      await expect(loginPage.usernameRequiredError).toBeVisible();
    });

  });

  test(`Using blank password`, async ({ loginPage }) => {

    await allure.step(`Enter valid username (${validUsernames.REGULAR.USERNAME}) and blank password`, async () => {
      await loginPage.login(validUsernames.REGULAR.USERNAME, "")
    });

    await allure.step(`Check if locked-out error is displayed.`, async () => {
      await expect(loginPage.passwordRequiredError).toBeVisible();
    });

  });
});