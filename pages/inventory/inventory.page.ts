import { Locator, Page } from "playwright/test";
import { InventoryItem } from "../../constants/inventory/inventory.constants";
import { BasePage } from "../base.page";

export class InventoryPage extends BasePage {
  public static readonly URL: string = "/inventory.html";

  constructor(public page: Page) { super(page); }

  private get hamburgerMenuButton(): Locator { return this.root.getByRole('button', { name: 'Open Menu' }); }
  private get hamburgerMenuNav(): Locator { return this.page.locator('nav.bm-item-list'); }

  async goto(): Promise<void> {
    Promise.all([this.page.waitForLoadState(), this.page.goto(InventoryPage.URL)]);
  }

  async logout(): Promise<void> {
    await this.selectHamburgerMenuOption('Logout');
  }

  private async selectHamburgerMenuOption(option: 'All Items' | 'About' | 'Logout' | 'Reset App State'): Promise<void> {
    await this.hamburgerMenuButton.click();
    switch (option.toLowerCase()) {
      case 'all items':
        await this.hamburgerMenuNav.getByTestId("inventory-sidebar-link").click();
        break;
      case 'about':
        await this.hamburgerMenuNav.getByTestId("about-sidebar-link").click();
        break;
      case 'logout':
        await this.hamburgerMenuNav.getByTestId("logout-sidebar-link").click();
        break;
      case 'reset app state':
        await this.hamburgerMenuNav.getByTestId("reset-sidebar-link").click();
        break;
    }
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    // Gets the inventory items as an array of objects with name, desc, and price
    const itemNameLocators: Locator = this.root.getByTestId('inventory-item-name');
    const itemDescriptionLocators: Locator = this.root.getByTestId('inventory-item-desc');
    const itemPriceLocators: Locator = this.root.getByTestId('inventory-item-price');
    const itemCount: number = await itemNameLocators.count();
    const items: { name: string; description: string; price: string }[] = [];
    for (let i = 0; i < itemCount; i++) {
      const name = await itemNameLocators.nth(i).innerText();
      const description = await itemDescriptionLocators.nth(i).innerText();
      const price = await itemPriceLocators.nth(i).innerText();
      items.push({ name, description, price });
    }
    return items;
  }

  private getInventoryItemCard(itemName: string): Locator {
    return this.root.getByTestId('inventory-item').filter({ has: this.page.getByTestId('inventory-item-name').getByText(itemName, { exact: true }) });
  }

  private getAddToCartButton(itemName: string): Locator {
    return this.getInventoryItemCard(itemName).getByRole("button", { name: "Add to cart" });
  }

  private getRemoveFromCartButton(itemName: string): Locator {
    return this.getInventoryItemCard(itemName).getByRole("button", { name: "Remove" });
  }

  async openInventoryItem(itemName: string): Promise<void> {
    const itemLink: Locator = this.getInventoryItemCard(itemName).getByTestId("inventory-item-name");
    await itemLink.click();
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    return await this.getRemoveFromCartButton(itemName).isVisible();
  }

  async isItemCanBeAddedToCart(itemName: string): Promise<boolean> {
    return await this.getAddToCartButton(itemName).isVisible();
  }

  async addItemToCart(itemName: string | string[]): Promise<void> {
    if (typeof itemName === "string") itemName = [itemName];
    for (const name of itemName) {
      if (await this.isItemInCart(name)) break;
      await this.getAddToCartButton(name).click();
    }
  }

  async removeItemFromCart(itemName: string | string[]): Promise<void> {
    if (typeof itemName === "string") itemName = [itemName];
    for (const name of itemName) {
      if (!(await this.isItemInCart(name))) break;
      await this.getRemoveFromCartButton(name).click();
    }
  }
}
