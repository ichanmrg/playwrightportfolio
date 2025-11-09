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
  inventoryItemPage: InventoryItemPage;
  inventoryItemDetails: (itemName: string | string[]) => Promise<InventoryItem[]>;
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
  },

  inventoryPage: async ({ loginPage }, use) => {
    await loginPage.login(LOGIN_CONSTANTS.VALID.REGULAR.USERNAME, process.env.DEFAULT_PASSWORD || "secret_sauce");
    const ip: InventoryPage = new InventoryPage(loginPage.page);
    await use(ip);
  },

  inventoryPageItems: async ({ inventoryPage }, use) => {
    await use(await inventoryPage.getInventoryItems());
  },

  randomItems: async ({ inventoryPageItems }, use) => {
    const itemNames: string[] = inventoryPageItems.map(item => item.name);
    const count = faker.number.int({ min: 1, max: itemNames.length });
    const selected = faker.helpers.arrayElements(itemNames, count);
    await use(itemNames.length > 0 ? selected : []);
  },

  randomItem: async ({ inventoryPageItems }, use) => {
    const itemNames: string[] = inventoryPageItems.map(item => item.name);
    const selected = faker.helpers.arrayElement(itemNames);
    await use(itemNames.length > 0 ? selected : "");
  },

  randomInventoryItemPage: async ({ inventoryPage, randomItem }, use) => {
    await inventoryPage.openInventoryItem(randomItem);
    await use(new InventoryItemPage(inventoryPage.page));
  },

  addedItemToCart: async ({ inventoryPage, randomItem }, use) => {
    await inventoryPage.addItemToCart(randomItem);
    await use(randomItem);
  },

  addedItemsToCart: async ({ inventoryPage, randomItems }, use) => {
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
