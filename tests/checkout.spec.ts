import * as allure from "allure-js-commons";
import { CheckoutDetails, makeCheckoutDetails, DEFAULT_TAX_RATE as taxRate } from "../constants/checkout/checkout.constants";
import { InventoryItem } from "../constants/inventory/inventory.constants";
import { expect, test } from "../fixtures/fixtures";
import { dollarsToCents } from "../utils/string-utils";

const checkoutDetails: CheckoutDetails = makeCheckoutDetails();

test.describe("Checkout Page > Field tests", () => {
    test(`Leave First Name field`, async ({ addedItemToCart, checkoutPage }) => {
        await allure.step(`Fill out form except first name`, async () => {
            await checkoutPage.fillCheckoutInformation({
                lastName: checkoutDetails.lastName,
                postalCode: checkoutDetails.postalCode
            });
        });

        await allure.step(`Verify that error message is shown for missing first name`, async () => {
            await expect(checkoutPage.firstNameRequiredError).toBeVisible();
        });
    });

    test(`Leave Last Name field`, async ({ addedItemToCart, checkoutPage }) => {
        await allure.step(`Fill out form except last name`, async () => {
            await checkoutPage.fillCheckoutInformation({
                firstName: checkoutDetails.firstName,
                postalCode: checkoutDetails.postalCode
            });
        });

        await allure.step(`Verify that error message is shown for missing last name`, async () => {
            await expect(checkoutPage.lastNameRequiredError).toBeVisible();
        });
    });

    test(`Leave Postal Code field`, async ({ addedItemToCart, checkoutPage }) => {
        await allure.step(`Fill out form except postal code`, async () => {
            await checkoutPage.fillCheckoutInformation({
                firstName: checkoutDetails.firstName,
                lastName: checkoutDetails.lastName
            });
        });
        await allure.step(`Click Continue button`, async () => {
            await checkoutPage.continue();
        });

        await allure.step(`Verify that error message is shown for missing last name`, async () => {
            await expect(checkoutPage.postalCodeRequiredError).toBeVisible();
        });
    });
});

test.describe("Check Checkout Details", () => {
    test(`Verify item details in checkout`, async ({ addedItemsToCart, checkoutPage, inventoryPageItems }) => {
        await allure.step(`Fill out form`, async () => {
            await checkoutPage.fillCheckoutInformation(checkoutDetails);
        });

        await allure.step(`Verify that items and details in checkout match the items added to cart`, async () => {
            let itemDetails: InventoryItem[] = [];
            for (const item of addedItemsToCart) {
                itemDetails = inventoryPageItems.filter(invItem => invItem.name === item);
                await expect(checkoutPage.getCartItemCard(item)).toBeVisible();
                expect(await checkoutPage.getCartItemDetails(item)).toEqual(itemDetails[0]);
            }
        });

        await allure.step(`Verify that price details are correct`, async () => {
            let itemDetails: InventoryItem[] = [];
            let expectedTotalPrice: number = 0;
            for (const item of addedItemsToCart) {
                itemDetails = inventoryPageItems.filter(invItem => invItem.name === item);
                if (itemDetails[0]) {
                    const priceNumber = parseFloat(itemDetails[0].price.replace("$", ""));
                    expectedTotalPrice += priceNumber;
                }
            }
            const expectedSubtotalCents = Math.round(dollarsToCents(expectedTotalPrice.toString()));
            const expectedTaxCents = Math.round(expectedSubtotalCents * taxRate);
            expect((await checkoutPage.getPriceDetails()).total).toEqual(expectedTaxCents + expectedSubtotalCents);
        })
    });
});

test.describe("End-to-end Checkout", () => {
    test(`Successfull Check-out`, async ({ addedItemsToCart, checkoutPage }) => {
        await allure.step(`Fill out form`, async () => {
            await checkoutPage.fillCheckoutInformation(checkoutDetails);
        });

        await allure.step(`Finish the checkout process`, async () => {
            await checkoutPage.finish();
        });

        await allure.step(`Verify that the checkout is completed successfully`, async () => {
            await expect(checkoutPage.thankYouForYourOrderHeader).toBeVisible();
        });
    });
});