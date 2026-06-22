export class StorePage {
  title: string;

  constructor() {
    this.title = '';
  }

  get cartBtn() {
    return $('[data-test="nav-cart"]');
  }

  get cartBadge() {
    return $('[data-test="cart-badge"]');
  }

  get userDisplay() {
    return $('[data-test="logged-in-user"]');
  }

  get logoutBtn() {
    return $('[data-test="logout-button"]');
  }

  async open(path = 'login') {
    await browser.url(`https://qa-task--oyettijon.replit.app/${path}`);
  }

  async clickCartBtn() {
    await this.cartBtn.click();
  }

  async getCartBadgeNumber() {
    if (!(await this.isCartBadgeDisplayed())) return 0;
    return Number(await this.cartBadge.getText());
  }

  async isCartBadgeDisplayed() {
    return this.cartBadge.isDisplayed();
  }

  async getUserName() {
    return this.userDisplay.getText();
  }

  async clickLogoutBtn() {
    await this.logoutBtn.click();
  }

  async waitForText(selector: ChainablePromiseElement, expectedText: string, timeout = 5000) {
    return await browser.waitUntil(
      async () => {
        const text = await selector.getText();
        return text === expectedText;
      },
      { timeout, interval: 50, timeoutMsg: `Button text never changed to "${expectedText}"` },
    );
  }
}

export default new StorePage();

