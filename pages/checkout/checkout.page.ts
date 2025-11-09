import { Locator, Page } from "playwright/test";
import { CheckoutDetails, PriceDetails } from "../../constants/checkout/checkout.constants";
import { dollarsToCents } from "../../utils/string-utils";
import { CartPage } from "../cart/cart.page";

export class CheckoutPage extends CartPage {
    constructor(public page: Page) { super(page); }

    private get checkoutInfoContainer(): Locator { return this.root.getByTestId('checkout-info-container'); }
    private get firstNameInput(): Locator { return this.checkoutInfoContainer.getByTestId('firstName'); }
    private get lastNameInput(): Locator { return this.checkoutInfoContainer.getByTestId('lastName'); }
    private get postalCodeInput(): Locator { return this.checkoutInfoContainer.getByTestId('postalCode'); }
    private get continueButton(): Locator { return this.checkoutInfoContainer.getByTestId('continue'); }


    public get firstNameRequiredError(): Locator { return this.error.filter({ hasText: "Error: First Name is required" }); }
    public get lastNameRequiredError(): Locator { return this.error.filter({ hasText: "Error: Last Name is required" }); }
    public get postalCodeRequiredError(): Locator { return this.error.filter({ hasText: "Error: Postal Code is required" }); }

    private get checkoutSummaryContainer(): Locator { return this.root.getByTestId('checkout-summary-container'); }

    private get subtotalDiv(): Locator { return this.checkoutSummaryContainer.getByTestId('subtotal-label'); }
    private get taxDiv(): Locator { return this.checkoutSummaryContainer.getByTestId('tax-label'); }
    private get totalDiv(): Locator { return this.checkoutSummaryContainer.getByTestId('total-label'); }

    private get finishButton(): Locator { return this.checkoutSummaryContainer.getByTestId('finish'); }

    private get checkoutCompleteContainer(): Locator { return this.root.getByTestId('checkout-complete-container'); }
    public get thankYouForYourOrderHeader(): Locator { return this.checkoutCompleteContainer.getByTestId('complete-header'); }

    async fillCheckoutInformation(form: CheckoutDetails): Promise<void> {
        if (form.firstName) await this.firstNameInput.fill(form.firstName);
        if (form.lastName) await this.lastNameInput.fill(form.lastName);
        if (form.postalCode) await this.postalCodeInput.fill(form.postalCode);
        await this.continue();
    }

    async getPriceDetails(): Promise<PriceDetails> {
        const subtotalText: string = await this.subtotalDiv.innerText();
        const taxText: string = await this.taxDiv.innerText();
        const totalText: string = await this.totalDiv.innerText();
        return {
            subtotal: dollarsToCents(subtotalText.replace("Item total: $", "")),
            tax: dollarsToCents(taxText.replace("Tax: $", "")),
            total: dollarsToCents(totalText.replace("Total: $", ""))
        }
    }

    async continue(): Promise<void> {
        await this.continueButton.click();
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }

}
