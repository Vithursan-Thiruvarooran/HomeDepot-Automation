import { StorePage } from './storePage';
import { messages } from '../testData/messages';

class OrderConfirmationPage extends StorePage {
  // ─── Elements ─────────────────────────────────────────────
  get successTitle() {
    return $('[data-test="checkout-success-title"]');
  }

  get successMessage() {
    return $('[data-test="checkout-success-message"]');
  }

  get continueShoppingButton() {
    return $('[data-test="back-to-home"]');
  }

  // ─── Actions ──────────────────────────────────────────────
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // ─── Validations ──────────────────────────────────────────
  async validateOrderPlaced() {
    await expect(this.successTitle).toBeDisplayed();
    await expect(this.successTitle).toHaveText(messages.orderPlacedTitle);
    await expect(this.successMessage).toHaveText(messages.orderConfirmation);
  }

  async validateOnConfirmationPage() {
    await $('[data-test="checkout-success-page"]').waitForDisplayed({ timeout: 5000 });
  }
}

export default new OrderConfirmationPage();

