// import { expect } from '@wdio/globals';
import { StorePage } from './storePage';

export interface Product {
  name: string;
  price: number;
}

class ProductPage extends StorePage {
  get productName() {
    return $('[data-test="product-detail-name"]');
  }

  get backToProductsBtn() {
    return $('[data-test="back-to-inventory-link"]');
  }

  async getProductName() {
    return this.productName.getText();
  }

  async clickOnBackToProductsBtn() {
    await this.backToProductsBtn.click();
  }
}

export default new ProductPage();

