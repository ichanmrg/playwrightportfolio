import { Locator, Page } from "playwright/test";
import { BasePage } from "../base.page";

export class LoginPage extends BasePage {
  constructor(public page: Page) { super(page); }

  public get usernameInput(): Locator { return this.root.getByTestId("username"); }
  public get passwordInput(): Locator { return this.root.getByTestId("password"); }
  public get loginButton(): Locator { return this.root.getByTestId("login-button"); }

  public get lockedOutError(): Locator { return this.error.filter({ hasText: "Epic sadface: Sorry, this user has been locked out." }); }
  public get usernameRequiredError(): Locator { return this.error.filter({ hasText: "Epic sadface: Username is required" }); }
  public get passwordRequiredError(): Locator { return this.error.filter({ hasText: "Epic sadface: Password is required" }); }
  public get usernamePasswordMismatchError(): Locator { return this.error.filter({ hasText: "Epic sadface: Username and password do not match any user in this service" }); }

  async goto(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.goto("/")
    ]);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
