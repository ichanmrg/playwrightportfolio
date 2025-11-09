import { Locator, Page } from "playwright/test";

export class BasePage {

    constructor(public page: Page) { };

    public get root(): Locator { return this.page.locator('div#root') };
    public get error(): Locator { return this.root.getByTestId("error"); }
    public get header(): Locator { return this.root.getByTestId('header-container'); }
    public get shoppingCartBadge(): Locator { return this.header.getByTestId('shopping-cart-badge'); }
    public get shoppingCartIcon(): Locator { return this.header.getByTestId('shopping-cart-link'); }

}