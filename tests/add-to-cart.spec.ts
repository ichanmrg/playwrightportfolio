import * as allure from "allure-js-commons";
import { expect, test } from "../fixtures/fixtures";

test.describe("Add to Cart", () => {
    test(`From the inventory page`, async ({ inventoryPage, randomItems }) => {
        await allure.step(`Add random item/s from the dashboard to cart`, async () => {
            await inventoryPage.addItemToCart(randomItems);
        });

        await allure.step(`Verify that the cart badge shows the correct number of items added`, async () => {
            await expect(inventoryPage.shoppingCartBadge).toHaveText(randomItems.length.toString());
        });
    });

    test(`From the item page`, async ({ randomInventoryItemPage }) => {
        await allure.step(`Add random item from the item page to cart`, async () => {
            await randomInventoryItemPage.addItemToCart();
        });

        await allure.step(`Verify that the cart badge shows the correct number of items added`, async () => {
            await expect(randomInventoryItemPage.shoppingCartBadge).toHaveText("1");
        });

    });
});