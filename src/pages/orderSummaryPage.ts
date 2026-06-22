import { StorePage } from './storePage';
import { parsePrice } from '../utils/helpers';

export interface CheckoutItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PaymentSummary {
  subtotal: number;
  tax: number;
  total: number;
}

class OrderSummaryPage extends StorePage {
  // ─── Navigation ───────────────────────────────────────────
  get backToFormButton() {
    return $('[data-test="back-to-form"]');
  }

  get pageTitle() {
    return $('[data-test="checkout-title"]');
  }

  // ─── Order items ──────────────────────────────────────────
  get checkoutItems() {
    return $$('[data-test="checkout-item"]');
  }

  checkoutItemName(id: number) {
    return $(`[data-test="checkout-item-name-${id}"]`);
  }

  checkoutItemQty(id: number) {
    return $(`[data-test="checkout-item-qty-${id}"]`);
  }

  checkoutItemSubtotal(id: number) {
    return $(`[data-test="checkout-item-subtotal-${id}"]`);
  }

  // ─── Payment summary ──────────────────────────────────────
  get subtotal() {
    return $('[data-test="checkout-subtotal"]');
  }

  get tax() {
    return $('[data-test="checkout-tax"]');
  }

  get total() {
    return $('[data-test="checkout-total"]');
  }

  // ─── Shipping info ────────────────────────────────────────
  get shippingInfo() {
    return $('[data-test="shipping-info"]');
  }

  // ─── Actions ──────────────────────────────────────────────
  get finishButton() {
    return $('[data-test="finish-button"]');
  }

  async finish() {
    await this.finishButton.click();
  }

  async goBackToForm() {
    await this.backToFormButton.click();
  }

  // ─── Data readers ─────────────────────────────────────────

  async getCheckoutItems(): Promise<CheckoutItem[]> {
    const items = await this.checkoutItems;
    const result: CheckoutItem[] = [];

    for (const item of items) {
      const id = (await item.getAttribute('id')).replace('checkout-item-', '');

      const nameText = await $(`[id="checkout-item-name-${id}"]`).getText();
      const qtyText = await $(`[id="checkout-item-qty-${id}"]`).getText();
      const subtotalText = await $(`[id="checkout-item-subtotal-${id}"]`).getText();

      const match = qtyText.match(/Qty:\s*(\d+)\s*×\s*\$?([\d.]+)/);
      if (!match) continue;

      result.push({
        name: nameText,
        quantity: Number(match[1]),
        unitPrice: parseFloat(match[2]),
        subtotal: parsePrice(subtotalText),
      });
    }

    return result;
  }

  async getPaymentSummary(): Promise<PaymentSummary> {
    return {
      subtotal: parsePrice(await this.subtotal.getText()),
      tax: parsePrice(await this.tax.getText()),
      total: parsePrice(await this.total.getText()),
    };
  }

  async getShippingInfo(): Promise<string> {
    return this.shippingInfo.getText();
  }

  // ─── Validations ──────────────────────────────────────────
  async validateCheckoutItems(expected: CheckoutItem[]) {
    const actual = await this.getCheckoutItems();
    expect(actual).toHaveLength(expected.length);

    for (const expectedItem of expected) {
      const actualItem = actual.find((i) => i.name === expectedItem.name);

      if (!actualItem) {
        throw new Error(`Item "${expectedItem.name}" not found in order summary`);
      }

      expect(actualItem.quantity).toBe(expectedItem.quantity);
      expect(actualItem.unitPrice).toBeCloseTo(expectedItem.unitPrice, 2);
      expect(actualItem.subtotal).toBeCloseTo(expectedItem.quantity * expectedItem.unitPrice, 2);
    }
  }

  async validatePaymentSummary(expected: Partial<PaymentSummary>) {
    const actual = await this.getPaymentSummary();
    if (expected.subtotal !== undefined) expect(actual.subtotal).toBeCloseTo(expected.subtotal, 2);
    if (expected.tax !== undefined) expect(actual.tax).toBeCloseTo(expected.tax, 2);
    if (expected.total !== undefined) expect(actual.total).toBeCloseTo(expected.total, 2);
  }

  async validateShippingInfo(firstName: string, lastName: string, postalCode: string) {
    const text = await this.getShippingInfo();
    expect(text).toContain(firstName);
    expect(text).toContain(lastName);
    expect(text).toContain(postalCode);
  }

  async validatePageTitle() {
    expect(await this.pageTitle.getText()).toBe('Order Summary');
  }
}

export default new OrderSummaryPage();

