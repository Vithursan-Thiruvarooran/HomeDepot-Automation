import { StorePage } from './storePage';

export interface Product {
  name: string;
  price: number;
}

class ProductsPage extends StorePage {
  private readonly productNameSelector = '[data-test="inventory-item-name"]';
  private readonly productPriceSelector = '[data-test="inventory-item-price"]';

  get inventoryTitle() {
    return $('[data-test="inventory-title"]');
  }

  get filterCategoryDrpDwn() {
    return $('[data-test="filter-category"]');
  }

  get sortDrpDwn() {
    return $('[data-test="sort-select"]');
  }

  get productCards() {
    return $$('[data-test="inventory-item"]');
  }

  get productNames() {
    return $$(this.productNameSelector);
  }

  get productPrices() {
    return $$(this.productPriceSelector);
  }

  // Returns the numeric item ID shared by the name element and its qty controls
  // e.g. "item-name-5" → "5". Returns null on pages without inventory-item-name IDs (e.g. detail page).
  private async getItemNumber(productName: string): Promise<string | null> {
    const names = await this.productNames;
    for (const nameEl of names) {
      if ((await nameEl.getText()) === productName) {
        const id = await nameEl.getAttribute('id');
        if (id?.startsWith('item-name-')) {
          return id.replace('item-name-', '');
        }
      }
    }
    return null;
  }

  async getInventoryTitle() {
    return this.inventoryTitle.getText();
  }

  async isInventoryTitleDisplayed() {
    return this.inventoryTitle.isDisplayed();
  }

  async selectFilterCategory(category: string) {
    await this.filterCategoryDrpDwn.selectByVisibleText(category);
  }

  async selectSort(sortOption: string) {
    await this.sortDrpDwn.selectByVisibleText(sortOption);
  }

  async getNumberOfProducts() {
    return (await this.productCards).length;
  }

  async getProducts(): Promise<Product[]> {
    const names = await this.productNames;
    const prices = await this.productPrices;

    const products: Product[] = [];

    for (let i = 0; i < (await names.length); i++) {
      products.push({
        name: await names[i].getText(),
        price: parseFloat((await prices[i].getText()).replace(/[^0-9.]/g, '')),
      });
    }

    return products;
  }

  async increaseQty(productName: string) {
    const num = await this.getItemNumber(productName);
    await (num ? $(`#qty-increase-${num}`) : $('[data-test^="qty-increase-"]')).click();
  }

  async decreaseQty(productName: string) {
    const num = await this.getItemNumber(productName);
    await (num ? $(`#qty-decrease-${num}`) : $('[data-test^="qty-decrease-"]')).click();
  }

  async setQty(productName: string, qty: number) {
    const current = await this.getQty(productName);
    const diff = qty - current;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) await this.increaseQty(productName);
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) await this.decreaseQty(productName);
    }
  }

  async getQty(productName: string): Promise<number> {
    const num = await this.getItemNumber(productName);
    const value = await (num ? $(`#qty-value-${num}`) : $('[data-test^="qty-value-"]')).getText();
    return Number(value);
  }

  async clickAddToCart(productName: string) {
    const num = await this.getItemNumber(productName);
    await (num ? $(`#inventory-item-${num} [data-test^="add-to-cart-"]`) : $('[data-test^="add-to-cart-"]')).click();
  }

  async getAddToCartBtnTxt(productName: string) {
    const num = await this.getItemNumber(productName);
    return (num ? $(`#inventory-item-${num} [data-test^="add-to-cart-"]`) : $('[data-test^="add-to-cart-"]')).getText();
  }

  async waitForAddToCartBtnTxt(productName: string, text: string) {
    const num = await this.getItemNumber(productName);
    return this.waitForText(
      num ? $(`#inventory-item-${num} [data-test^="add-to-cart-"]`) : $('[data-test^="add-to-cart-"]'),
      text,
    );
  }

  async clickProduct(productName: string) {
    const names = await this.productNames;

    for (const nameEl of names) {
      const text = await nameEl.getText();
      if (text === productName) {
        await nameEl.click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found on page`);
  }
}

export default new ProductsPage();
