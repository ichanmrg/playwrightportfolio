import { faker } from "@faker-js/faker";

export type CheckoutDetails = {
    firstName?: string;
    lastName?: string;
    postalCode?: string;
}

export type PriceDetails = { subtotal: number; tax: number; total: number };

export const DEFAULT_TAX_RATE = 8.00 / 100 // 8%

export const makeCheckoutDetails = (): CheckoutDetails => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode("#####"),
    };
}