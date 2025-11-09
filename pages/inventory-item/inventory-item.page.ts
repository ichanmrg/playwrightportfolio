import { Locator, Page } from "playwright/test";
import { InventoryItem } from "../../constants/inventory/inventory.constants";
import { BasePage } from "../base.page";

export class InventoryItemPage extends BasePage {

    constructor(public page: Page) { super(page); }

    private get inventoryItem(): Locator { return this.root.getByTestId('inventory-item'); }
    private get inventoryItemName(): Locator { return this.inventoryItem.getByTestId("inventory-item-name"); }
    private get inventoryItemDescription(): Locator { return this.inventoryItem.getByTestId("inventory-item-desc"); }
    private get inventoryItemPrice(): Locator { return this.inventoryItem.getByTestId("inventory-item-price"); }
    public get addToCartButton(): Locator { return this.inventoryItem.getByTestId("add-to-cart"); }
    public get removeToCartButton(): Locator { return this.inventoryItem.getByTestId("remove"); }

    async getInventoryItemDetails(): Promise<InventoryItem> {
        const name = await this.inventoryItemName.innerText();
        const description = await this.inventoryItemDescription.innerText();
        const price = await this.inventoryItemPrice.innerText();
        return { name, description, price };
    }

    async addItemToCart(): Promise<void> { await this.addToCartButton.click(); }

    async removeItemFromCart(): Promise<void> { await this.removeToCartButton.click(); }

    async isItemInCart(): Promise<boolean> { return await this.removeToCartButton.isVisible(); }

    async isItemCanBeAddedToCart(): Promise<boolean> { return await this.addToCartButton.isVisible(); }
}
