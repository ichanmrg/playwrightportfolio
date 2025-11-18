import * as allure from "allure-js-commons";
import { expect, test } from "../fixtures/fixtures";

test.describe("Remove from Cart", () => {
    test(`Remove from Cart > From the inventory page`, async ({ inventoryPage, addedItemToCart }) => {
        await allure.step(`Remove item named "${addedItemToCart}" using the dashboard`, async () => {
            await inventoryPage.removeItemFromCart(addedItemToCart);
        });

        await allure.step(`Check if "Add to cart" button is back for item "${addedItemToCart}"`, async () => {
            expect(await inventoryPage.isItemCanBeAddedToCart(addedItemToCart)).toBe(true);
        });

        await allure.step(`Check if shopping cart count badge is invisible`, async () => {
            await expect(inventoryPage.shoppingCartBadge).not.toBeVisible();
        });
    });

    test(`Remove from Cart > From the item page`, async ({ addedItemToCartViaItemPage }) => {
        await allure.step(`Remove item using its item page`, async () => {
            await addedItemToCartViaItemPage.removeItemFromCart();
        });

        await allure.step(`Check if "Add to cart" button is back for the item`, async () => {
            await expect(addedItemToCartViaItemPage.addToCartButton).toBeVisible();
            await expect(addedItemToCartViaItemPage.removeToCartButton).not.toBeVisible();
        });

        await allure.step(`Check if shopping cart count badge is invisible`, async () => {
            await expect(addedItemToCartViaItemPage.shoppingCartBadge).not.toBeVisible();
        });
    });

    test(`From the cart`, async ({ addedItemToCart, cartPage }) => {
        await allure.step(`Remove item using its item page`, async () => {
            await cartPage.removeItemFromCart(addedItemToCart);
        });

        await allure.step(`Check if item "${addedItemToCart}" is no longer in the cart`, async () => {
            expect(await cartPage.isItemInCart(addedItemToCart)).toBe(false);
        });

        await allure.step(`Check if shopping cart count badge is invisible`, async () => {
            await expect(cartPage.shoppingCartBadge).not.toBeVisible();
        });
    });
});