import { faker } from "@faker-js/faker";
import { test as base, expect } from "@playwright/test";
import { InventoryItem } from "../constants/inventory/inventory.constants";
import { LOGIN_CONSTANTS } from "../constants/login/login.constants";
import { CartPage } from "../pages/cart/cart.page";
import { CheckoutPage } from "../pages/checkout/checkout.page";
import { InventoryItemPage } from "../pages/inventory-item/inventory-item.page";
import { InventoryPage } from "../pages/inventory/inventory.page";
import { LoginPage } from "../pages/login/login.page";

// Test-scoped fixtures
type TestFx = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryPageItems: InventoryItem[];
  randomItems: string[];
  randomItem: string;
  randomInventoryItemPage: InventoryItemPage;
  addedItemToCart: string;
  addedItemsToCart: string[];
  addedItemToCartViaItemPage: InventoryItemPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage
};

export const test = base.extend<TestFx>({
  loginPage: async ({ page }, use) => {
    const lp: LoginPage = new LoginPage(page);
    await lp.goto();
    await use(lp);
    await lp.page.close();
  },

  inventoryPage: async ({ loginPage }, use) => {
    await loginPage.login(LOGIN_CONSTANTS.VALID.REGULAR.USERNAME, process.env.DEFAULT_PASSWORD || LOGIN_CONSTANTS.VALID.REGULAR.PASSWORD);
    const ip: InventoryPage = new InventoryPage(loginPage.page);
    await use(ip);
  },

  inventoryPageItems: async ({ inventoryPage }, use) => {
    await use(await inventoryPage.getInventoryItems());
  },

  randomItems: async ({ inventoryPageItems }, use) => {
    if (inventoryPageItems.length === 0) {
      await use([]);
      return;
    }
    const itemNames: string[] = inventoryPageItems.map(item => item.name);
    const count = faker.number.int({ min: 1, max: itemNames.length });
    await use(faker.helpers.arrayElements(itemNames, count));
  },

  randomItem: async ({ inventoryPageItems }, use) => {
    if (inventoryPageItems.length === 0) {
      await use("");
      return;
    }
    const itemNames: string[] = inventoryPageItems.map(item => item.name);
    await use(faker.helpers.arrayElement(itemNames));
  },

  randomInventoryItemPage: async ({ inventoryPage, randomItem }, use, testInfo) => {
    if (!randomItem) testInfo.skip();
    await inventoryPage.openInventoryItem(randomItem);
    await use(new InventoryItemPage(inventoryPage.page));
  },

  addedItemToCart: async ({ inventoryPage, randomItem }, use, testInfo) => {
    if (!randomItem) testInfo.skip();
    await inventoryPage.addItemToCart(randomItem);
    await use(randomItem);
  },

  addedItemsToCart: async ({ inventoryPage, randomItems }, use, testInfo) => {
    if (!randomItems || randomItems.length === 0) testInfo.skip();
    await inventoryPage.addItemToCart(randomItems);
    await use(randomItems);
  },

  addedItemToCartViaItemPage: async ({ randomInventoryItemPage }, use) => {
    await randomInventoryItemPage.addItemToCart();
    await use(randomInventoryItemPage);
  },

  cartPage: async ({ inventoryPage }, use) => {
    const cp: CartPage = new CartPage(inventoryPage.page);
    await cp.shoppingCartIcon.click();
    await cp.page.waitForLoadState();
    await use(cp);
  },

  checkoutPage: async ({ cartPage }, use) => {
    await cartPage.proceedToCheckout();
    await use(new CheckoutPage(cartPage.page));
  },

});

export { expect };
