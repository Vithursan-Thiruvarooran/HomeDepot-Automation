import { StorePage } from './storePage';
import { parsePrice } from '../utils/helpers';

export interface OrderPreviewItem {
  name: string;
  quantity: number;
  total: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

class CheckoutPage extends StorePage {
  // ─── Navigation ───────────────────────────────────────────
  get backToCart() {
    return $('[data-test="back-to-cart"]');
  }

  get checkoutTitle() {
    return $('[data-test="checkout-title"]');
  }

  // ─── Form fields ──────────────────────────────────────────
  get firstNameInput() {
    return $('[data-test="checkout-first-name"]');
  }

  get lastNameInput() {
    return $('[data-test="checkout-last-name"]');
  }

  get postalCodeInput() {
    return $('[data-test="checkout-postal-code"]');
  }

  get continueButton() {
    return $('[data-test="continue-to-summary"]');
  }

  // ─── Order preview ────────────────────────────────────────
  get orderPreviewSummary() {
    return $('[data-test="cart-preview-summary"]');
  }

  get previewTotal() {
    return $('[data-test="preview-total"]');
  }

  get previewItems() {
    return $$('[data-test="cart-preview-summary"] .space-y-2 > div');
  }

  get previewItemLabels() {
    return $$('[data-test="cart-preview-summary"] .space-y-2 .truncate');
  }

  get previewItemTotals() {
    return $$('[data-test="cart-preview-summary"] .space-y-2 .font-medium');
  }

  // ─── Actions ──────────────────────────────────────────────
  async fillShippingInfo(info: ShippingInfo) {
    await this.firstNameInput.setValue(info.firstName);
    await this.lastNameInput.setValue(info.lastName);
    await this.postalCodeInput.setValue(info.postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async fillAndContinue(info: ShippingInfo) {
    await this.fillShippingInfo(info);
    await this.continue();
  }

  // ─── Data readers ─────────────────────────────────────────

  async getPreviewTotal(): Promise<number> {
    return parsePrice(await this.previewTotal.getText());
  }

  async getPreviewItems(): Promise<OrderPreviewItem[]> {
    const labels = await this.previewItemLabels;
    const totals = await this.previewItemTotals;
    const result: OrderPreviewItem[] = [];

    for (let i = 0; i < (await labels.length); i++) {
      const labelText = await labels[i].getText(); // "Automation Handbook × 5"
      const totalText = await totals[i].getText(); // "$124.95"

      const match = labelText.match(/^(.+)\s×\s(\d+)$/);
      if (!match) continue;

      result.push({
        name: match[1].trim(),
        quantity: Number(match[2]),
        total: parsePrice(totalText),
      });
    }

    return result;
  }

  // ─── Validations ──────────────────────────────────────────
  async validatePreviewItems(expected: OrderPreviewItem[]) {
    const actual = await this.getPreviewItems();
    expect(actual).toHaveLength(expected.length);

    for (const expectedItem of expected) {
      const actualItem = actual.find((i) => i.name === expectedItem.name);

      if (!actualItem) {
        throw new Error(`Item "${expectedItem.name}" not found in order preview`);
      }

      expect(actualItem.quantity).toBe(expectedItem.quantity);
      expect(actualItem.total).toBeCloseTo(expectedItem.total, 2);
    }
  }

  async validatePreviewTotal(expectedTotal: number) {
    const actual = await this.getPreviewTotal();
    expect(actual).toBeCloseTo(expectedTotal, 2);
  }

  async validateFormIsEmpty() {
    expect(await this.firstNameInput.getValue()).toBe('');
    expect(await this.lastNameInput.getValue()).toBe('');
    expect(await this.postalCodeInput.getValue()).toBe('');
  }
}

export default new CheckoutPage();

