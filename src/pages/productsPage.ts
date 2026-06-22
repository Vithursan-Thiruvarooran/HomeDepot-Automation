import { StorePage } from './storePage';
import { toSlug } from '../utils/helpers';

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

  productCard(id: number) {
    return $(`[data-test="inventory-item-${id}"]`);
  }

  increaseQtyBtn(productName: string) {
    return $(`[data-test="qty-increase-${toSlug(productName)}"]`);
  }

  decreaseQtyBtn(productName: string) {
    return $(`[data-test="qty-decrease-${toSlug(productName)}"]`);
  }

  qtyNum(productName: string) {
    return $(`[data-test="qty-value-${toSlug(productName)}"]`);
  }

  addToCartBtn(productName: string) {
    return $(`[data-test="add-to-cart-${toSlug(productName)}"]`);
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
    await this.increaseQtyBtn(productName).click();
  }

  async decreaseQty(productName: string) {
    await this.decreaseQtyBtn(productName).click();
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
    const value = await this.qtyNum(productName).getText();
    return Number(value);
  }

  async clickAddToCart(productName: string) {
    await this.addToCartBtn(productName).click();
  }

  async getAddToCartBtnTxt(productName: string) {
    return await this.addToCartBtn(productName).getText();
  }

  async waitForAddToCartBtnTxt(productName: string, text: string) {
    const success = await this.waitForText(this.addToCartBtn(productName), text);
    return success;
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

