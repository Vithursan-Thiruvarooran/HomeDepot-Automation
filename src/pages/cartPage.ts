// import { expect } from '@wdio/globals';
import { StorePage } from './storePage';

export interface Product {
  name: string;
  price: number;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
}

class CartPage extends StorePage {
  get emptyCartMsg() {
    return $('[data-test="cart-empty-title"]');
  }

  get checkoutButton() {
    return $('[data-test="checkout-button"]');
  }

  get continueShoppingBtn() {
    return $('[data-test="continue-shopping"]');
  }

  get cartItems() {
    return $$('[data-test="cart-item"]');
  }

  get cartTitle() {
    return $('[data-test="cart-title"]');
  }

  get subtotal() {
    return $('[data-test="cart-subtotal"]');
  }

  get tax() {
    return $('[data-test="cart-tax"]');
  }

  get total() {
    return $('[data-test="cart-total"]');
  }

  cartItemName(id: number) {
    return $(`[data-test="cart-item-name-${id}"]`);
  }

  cartItemPrice(id: number) {
    return $(`[data-test="cart-item-price-${id}"]`);
  }

  cartItemQty(id: number) {
    return $(`[data-test="quantity-item-${id}"]`);
  }

  cartItemTotal(id: number) {
    return $(`[data-test="cart-item-total-${id}"]`);
  }

  increaseQtyBtn(id: number) {
    return $(`[data-test="increase-qty-item-${id}"]`);
  }

  decreaseQtyBtn(id: number) {
    return $(`[data-test="decrease-qty-item-${id}"]`);
  }

  removeItemBtn(id: number) {
    return $(`[data-test="remove-item-${id}"]`);
  }

  async increaseQty(id: number) {
    await this.increaseQtyBtn(id).click();
  }

  async decreaseQty(id: number) {
    await this.decreaseQtyBtn(id).click();
  }

  async removeItem(id: number) {
    await this.removeItemBtn(id).click();
  }

  async getCartItemQty(id: number): Promise<number> {
    return Number(await this.cartItemQty(id).getText());
  }

  private parsePrice(text: string): number {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getCartItems(): Promise<CartItem[]> {
    const items = await this.cartItems;
    const result: CartItem[] = [];

    for (const item of items) {
      const id = (await item.getAttribute('data-test-item-id')).replace('cart-item-', '');

      result.push({
        name: await $(`[id="cart-item-name-${id}"]`).getText(),
        price: this.parsePrice(await $(`[id="cart-item-price-${id}"]`).getText()),
        quantity: Number(await $(`[id="quantity-item-${id}"]`).getText()),
        total: this.parsePrice(await $(`[id="cart-item-total-${id}"]`).getText()),
      });
    }

    return result;
  }

  async getCartSummary(): Promise<CartSummary> {
    return {
      subtotal: this.parsePrice(await this.subtotal.getText()),
      tax: this.parsePrice(await this.tax.getText()),
      total: this.parsePrice(await this.total.getText()),
    };
  }

  async isEmptyCartDisplayed() {
    return this.emptyCartMsg.isDisplayed();
  }

  async getEmptyCartMsg() {
    return this.emptyCartMsg.getText();
  }

  async clickContinueShoppingBtn() {
    await this.continueShoppingBtn.click();
  }

  async clickCheckoutBtn() {
    await this.checkoutButton.click();
  }

  // ─── Validations ──────────────────────────────────────────
  async validateCartItems(expected: CartItem[]) {
    const actual = await this.getCartItems();
    expect(actual).toHaveLength(expected.length);

    for (const expectedItem of expected) {
      const actualItem = actual.find((i) => i.name === expectedItem.name);
      expect(actualItem).toBeDefined();
      expect(actualItem!.quantity).toBe(expectedItem.quantity);
      expect(actualItem!.price).toBe(expectedItem.price);
      expect(actualItem!.total).toBeCloseTo(expectedItem.price * expectedItem.quantity, 2);
    }
  }

  async validateCartSummary(expected: Partial<CartSummary>) {
    const actual = await this.getCartSummary();
    if (expected.subtotal !== undefined) expect(actual.subtotal).toBeCloseTo(expected.subtotal, 2);
    if (expected.tax !== undefined) expect(actual.tax).toBeCloseTo(expected.tax, 2);
    if (expected.total !== undefined) expect(actual.total).toBeCloseTo(expected.total, 2);
  }

  calculateTotals(cart: CartItem[], taxRate = 0.08) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }
}

export default new CartPage();

