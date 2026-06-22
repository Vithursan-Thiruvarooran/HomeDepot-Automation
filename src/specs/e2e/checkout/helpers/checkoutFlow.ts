import { expect } from '@wdio/globals';
import { categories } from '../../../../testData/productCategories';
import { sortOptions } from '../../../../testData/sortOptions';
import { products } from '../../../../testData/products';
import { messages } from '../../../../testData/messages';
import { customers } from '../../../../testData/customers';

import storePage from '../../../../pages/storePage';
import loginPage from '../../../../pages/loginPage';
import productsPage, { Product } from '../../../../pages/productsPage';
import productPage from '../../../../pages/productPage';
import cartPage from '../../../../pages/cartPage';
import checkoutPage from '../../../../pages/checkoutPage';
import orderSummaryPage from '../../../../pages/orderSummaryPage';
import orderConfirmationPage from '../../../../pages/orderConfirmationPage';

const allCategories = categories[0].name;

export interface TestUser {
  username: string;
  password: string;
}

export function runCheckoutFlow(user: TestUser) {
  const productA = products[0];
  const productB = products[2];

  const cart = [
    { ...productA, quantity: 3, total: productA.price * 3 },
    { ...productB, quantity: 3, total: productB.price * 3 },
  ];

  const totals = cartPage.calculateTotals(cart);

  describe(`Automation Challenge: User: ${user.username}`, () => {
    // ─── Login ────────────────────────────────────────────────

    it('should load the page with the correct title', async () => {
      await loginPage.open();
      expect(await browser.getTitle()).toStrictEqual('QA Automation Assessment');
    });

    it('should log in and land on the products page', async () => {
      await loginPage.login(user.username, user.password);
      await expect(await productsPage.getInventoryTitle()).toStrictEqual(messages.inventoryTitle);
      await expect(await storePage.getUserName()).toStrictEqual(user.username);
    });

    // ─── Category Filters ─────────────────────────────────────

    for (const category of categories) {
      it(`should show correct product count for: ${category.name}`, async () => {
        await productsPage.selectFilterCategory(category.name);
        await expect(await productsPage.getNumberOfProducts()).toBe(category.count);
      });
    }

    // ─── Sort Filters ─────────────────────────────────────────

    for (const sortOption of sortOptions) {
      it(`should sort correctly: ${sortOption.name}`, async () => {
        await productsPage.selectFilterCategory(allCategories);
        await productsPage.selectSort(sortOption.name);
        const products = await productsPage.getProducts();

        const field = sortOption.field as keyof Product;
        const values = products.map((p) => p[field]);

        const sorted = [...values].sort((a, b) => {
          if (typeof a === 'string' && typeof b === 'string') {
            return sortOption.ascending ? a.localeCompare(b) : b.localeCompare(a);
          }
          return sortOption.ascending ? (a as number) - (b as number) : (b as number) - (a as number);
        });

        expect(values).toEqual(sorted);
      });
    }

    // ─── Initial Cart State ───────────────────────────────────

    it('should show no cart badge on page load', async () => {
      await expect(await storePage.isCartBadgeDisplayed()).toBe(false);
      await storePage.clickCartBtn();
      await expect(await cartPage.isEmptyCartDisplayed()).toBe(true);
      await expect(await cartPage.getEmptyCartMsg()).toStrictEqual(messages.emptyCart);
      await cartPage.clickContinueShoppingBtn();
      await expect(await productsPage.isInventoryTitleDisplayed()).toBe(true);
      await expect(await productsPage.getInventoryTitle()).toStrictEqual(messages.inventoryTitle);
    });

    // ─── Product Page ─────────────────────────────────────────

    it('should show no cart badge before adding items', async () => {
      await expect(await storePage.isCartBadgeDisplayed()).toBe(false);
    });

    it('should increment and decrement qty for productA', async () => {
      await expect(await productsPage.getQty(productA.name)).toEqual(1);
      await productsPage.increaseQty(productA.name);
      await expect(await productsPage.getQty(productA.name)).toEqual(2);
      await productsPage.increaseQty(productA.name);
      await expect(await productsPage.getQty(productA.name)).toEqual(3);
      await productsPage.decreaseQty(productA.name);
      await expect(await productsPage.getQty(productA.name)).toEqual(2);
      await productsPage.decreaseQty(productA.name);
      await productsPage.decreaseQty(productA.name);
      await expect(await productsPage.getQty(productA.name)).toEqual(1);
    });

    it('should add productA to cart and update badge', async () => {
      await productsPage.clickAddToCart(productA.name);
      await expect(await storePage.isCartBadgeDisplayed()).toBe(true);
      await expect(await storePage.getCartBadgeNumber()).toEqual(1);
    });

    // ─── Product Detail Page ──────────────────────────────────

    it('should navigate to product detail and show correct state', async () => {
      await productsPage.clickProduct(productA.name);
      await expect(await productPage.getProductName()).toStrictEqual(productA.name);
      await expect(await productsPage.getAddToCartBtnTxt(productA.name)).toStrictEqual(messages.addAnother);
      await expect(await productsPage.getQty(productA.name)).toEqual(1);
    });

    it('should add more qty for productA from detail page and update badge', async () => {
      await productsPage.increaseQty(productA.name);
      await productsPage.increaseQty(productA.name);
      await expect(await productsPage.getQty(productA.name)).toEqual(3);
      await productsPage.decreaseQty(productA.name);
      await expect(await productsPage.getQty(productA.name)).toEqual(2);
      await productsPage.clickAddToCart(productA.name);
      await expect(await productsPage.getAddToCartBtnTxt(productA.name)).toStrictEqual(messages.added);
      await expect(await storePage.getCartBadgeNumber()).toEqual(3);
      await expect(await productsPage.waitForAddToCartBtnTxt(productA.name, messages.addAnother)).toBe(true);
    });

    it('should return to products page from product detail', async () => {
      await productPage.clickOnBackToProductsBtn();
      await expect(await productsPage.getInventoryTitle()).toStrictEqual(messages.inventoryTitle);
    });

    // ─── Add Product B ────────────────────────────────────────

    it('should set qty and add productB to cart', async () => {
      await productsPage.setQty(productB.name, 3);
      await productsPage.clickAddToCart(productB.name);
      await expect(await storePage.getCartBadgeNumber()).toEqual(6);
    });

    // ─── Cart ─────────────────────────────────────────────────

    it('should validate cart items and summary', async () => {
      await storePage.clickCartBtn();
      await cartPage.validateCartItems(cart);
      await cartPage.validateCartSummary(totals);
    });

    // ─── Checkout ─────────────────────────────────────────────

    it('should validate checkout preview and fill shipping form', async () => {
      await cartPage.clickCheckoutBtn();
      await checkoutPage.validatePreviewItems(cart.map((item) => ({ name: item.name, quantity: item.quantity, total: item.total })));
      await checkoutPage.validatePreviewTotal(totals.total);
      await checkoutPage.fillAndContinue(customers[0]);
    });

    // ─── Order Summary ────────────────────────────────────────

    it('should validate order summary and shipping info', async () => {
      await orderSummaryPage.validatePageTitle();
      await orderSummaryPage.validateCheckoutItems(
        cart.map((item) => ({
          name: item.name,
          unitPrice: item.price,
          quantity: item.quantity,
          subtotal: item.total,
        })),
      );
      await orderSummaryPage.validatePaymentSummary(totals);
      await orderSummaryPage.validateShippingInfo(customers[0].firstName, customers[0].lastName, customers[0].postalCode);
      await orderSummaryPage.finish();
    });

    // ─── Order Confirmation ───────────────────────────────────

    it('should show order confirmation and clear cart badge', async () => {
      await orderConfirmationPage.validateOnConfirmationPage();
      await orderConfirmationPage.validateOrderPlaced();
      await expect(await storePage.isCartBadgeDisplayed()).toBe(false);
      await orderConfirmationPage.continueShopping();
    });
  });
}

