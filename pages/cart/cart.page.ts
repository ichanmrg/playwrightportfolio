import { Locator, Page } from "playwright/test";
import { InventoryItem } from "../../constants/inventory/inventory.constants";
import { BasePage } from "../base.page";

export class CartPage extends BasePage {

    constructor(public page: Page) { super(page); }

    // private get cartContentsContainer(): Locator { return this.root.getByTestId('cart-contents-container'); }
    private get cartList(): Locator { return this.root.getByTestId('cart-list'); }
    private get cartItem(): Locator { return this.cartList.getByTestId('inventory-item'); }
    private get checkoutButton(): Locator { return this.root.getByTestId('checkout'); }

    async getCartItemsCount(): Promise<number> { return await this.cartItem.count(); }

    getCartItemCard(itemName: string): Locator { return this.cartItem.filter({ has: this.page.getByTestId('inventory-item-name').getByText(itemName, { exact: true }) }); }

    async isItemInCart(itemName: string): Promise<boolean> { return await this.getCartItemCard(itemName).count() > 0; }

    async getCartItemDetails(itemName: string): Promise<InventoryItem> {
        const itemCard: Locator = this.getCartItemCard(itemName);
        const name: string = await itemCard.getByTestId('inventory-item-name').innerText();
        const description: string = await itemCard.getByTestId('inventory-item-desc').innerText();
        const price: string = await itemCard.getByTestId('inventory-item-price').innerText();
        return { name, description, price };
    }

    async getCartItemQuantity(itemName: string): Promise<number> {
        const quantityLocator: Locator = this.getCartItemCard(itemName).getByTestId('cart-item-quantity');
        const quantityText: string = await quantityLocator.innerText();
        return parseInt(quantityText);
    }

    async removeItemFromCart(itemName: string): Promise<void> {
        const removeButton: Locator = this.getCartItemCard(itemName).getByRole('button', { name: 'Remove' });
        await removeButton.click();
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}
