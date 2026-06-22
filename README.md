# HomeDepot Automation — WebdriverIO E2E Test Suite

End-to-end automation tests for the SwiftShop QA Assessment application, written with WebdriverIO and TypeScript.

---

## Assumptions

1. **A single e2e flow was expected.** The assignment was interpreted as requiring one end-to-end flow test covering all steps from login through to order confirmation. In practice, I would split this into smaller, focused tests for each functional area (login, filters, cart, checkout) and reserve the e2e flow for broader coverage across user journeys rather than deep validation of each step.
2. **The `vault_locked` user is intentionally locked out.** The e2e checkout flow runs for 3 of the 4 available users (`swift_tester`, `buggy_agent`, `mirage_user`). The fourth user, `vault_locked`, cannot log in and was excluded from the e2e flow. It was assumed this user is intentionally locked out, so a separate login test (`login.vault_locked.ts`) was added to validate that the correct error message is displayed on login attempt.
3. **The Sauce Labs Onesie data-test IDs are incorrect.** The data-test IDs for the Sauce Labs Onesie product do not follow the naming convention used by all other products — they omit the `sauce-labs-` prefix (e.g. `qty-value-onesie` instead of `qty-value-sauce-labs-onesie`). This was treated as a bug rather than intentional, and the automation was written against the expected correct IDs consistent with the rest of the product catalogue.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (includes npm)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd HomeDepot-Automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Tests

```bash
# Run all tests
npm run wdio

# Run a single spec file
npx wdio run wdio.conf.ts --spec src/specs/e2e/checkout/checkout.swift_tester.e2e.ts
```

---

## Project Structure

```
src/
  specs/
    accessPage.ts                              ← smoke test (page title)
    login.vault_locked.ts                      ← login test for locked-out user
    e2e/
      checkout/
        helpers/
          checkoutFlow.ts                      ← shared e2e flow logic
        checkout.swift_tester.e2e.ts           ← e2e flow for swift_tester
        checkout.buggy_agent.e2e.ts            ← e2e flow for buggy_agent
        checkout.mirage_user.e2e.ts            ← e2e flow for mirage_user
  pages/
    storePage.ts
    loginPage.ts
    productsPage.ts
    productPage.ts
    cartPage.ts
    checkoutPage.ts
    orderSummaryPage.ts
    orderConfirmationPage.ts
  testData/
    users.ts
    products.ts
    productCategories.ts
    sortOptions.ts
    customers.ts
    messages.ts
```

---

## Parallel Execution

The e2e checkout flow runs in **parallel across 3 users** simultaneously. Each user gets its own browser session via a separate spec file, all sharing the same logic from `checkoutFlow.ts`.

```
checkout.swift_tester.e2e.ts  ──┐
checkout.buggy_agent.e2e.ts   ──┼──► runCheckoutFlow(user)  [3 workers in parallel]
checkout.mirage_user.e2e.ts   ──┘
```

Set `maxInstances: 3` in `wdio.conf.ts` to allow all three workers to run simultaneously.

| Spec File                      | User           |
| ------------------------------ | -------------- |
| `checkout.swift_tester.e2e.ts` | `swift_tester` |
| `checkout.buggy_agent.e2e.ts`  | `buggy_agent`  |
| `checkout.mirage_user.e2e.ts`  | `mirage_user`  |

---

## Test Cases

---

### TC-01 — Page Title

**Spec:** `accessPage.ts` / `checkoutFlow.ts`

**Objective:** Verify the application loads with the correct browser tab title.

**Preconditions:** Application is accessible.

**Steps:**

1. Navigate to the login page.
2. Assert the browser tab title equals `QA Automation Assessment`.

**Expected Result:** Browser tab title is correct.

---

### TC-02 — Login

**Spec:** `checkoutFlow.ts`

**Objective:** Verify that a valid user can log in and land on the products page.

**Preconditions:** Application is accessible and user credentials are valid.

**Steps:**

1. Enter valid credentials for the test user.
2. Submit the login form.
3. Assert the inventory page title equals `Products`.
4. Assert the logged-in username displayed in the header matches the test user.

**Expected Result:** User is logged in, redirected to the products page, and their username is shown in the header.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-03 — Category Filter

**Spec:** `checkoutFlow.ts`

**Objective:** Verify that filtering by category shows the correct number of products.

**Preconditions:** User is logged in and on the products page.

**Steps:**

1. For each category (All Categories, Apparel, Accessories, Gear, Books):
   1. Select the category from the filter dropdown.
   2. Assert the number of visible product cards matches the expected count for that category.

**Expected Result:** Each category filter returns the correct product count.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-04 — Sort Filter

**Spec:** `checkoutFlow.ts`

**Objective:** Verify that sorting products reorders them correctly.

**Preconditions:** User is logged in and on the products page with all categories selected.

**Steps:**

1. For each sort option (Name A–Z, Name Z–A, Price Low–High, Price High–Low):
   1. Select all categories.
   2. Select the sort option from the sort dropdown.
   3. Read all product names or prices from the page.
   4. Assert the order matches the expected sort direction.

**Expected Result:** Products are sorted correctly for all four sort options.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-05 — Initial Cart State

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the cart is empty on first login and the empty state is displayed correctly.

**Preconditions:** User is logged in; no items have been added to the cart.

**Steps:**

1. Assert the cart badge is not visible in the header.
2. Click the cart icon in the header.
3. Assert the empty cart message is displayed.
4. Assert the empty cart message text equals `Your cart is empty`.
5. Click "Continue Shopping".
6. Assert the products page title is displayed.

**Expected Result:** Empty cart state is shown correctly and navigation back to products works.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-06 — Quantity Controls on Products Page

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the quantity increment and decrement controls work correctly on the products listing page.

**Preconditions:** User is logged in and on the products page.

**Steps:**

1. Assert the default quantity for Product A is `1`.
2. Click increase qty — assert qty is `2`.
3. Click increase qty — assert qty is `3`.
4. Click decrease qty — assert qty is `2`.
5. Click decrease qty — assert qty is `1`.
6. Click decrease qty — assert qty remains `1` (does not go below 1).

**Expected Result:** Quantity controls correctly increment and decrement, and cannot go below 1.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-07 — Add to Cart from Products Page

**Spec:** `checkoutFlow.ts`

**Objective:** Verify adding a product to the cart updates the cart badge correctly.

**Preconditions:** User is logged in; Product A quantity is set to `1`.

**Steps:**

1. Assert the cart badge is not visible.
2. Click "Add to Cart" for Product A.
3. Assert the cart badge is visible.
4. Assert the cart badge count equals `1`.

**Expected Result:** Cart badge appears and shows the correct item count after adding a product.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-08 — Product Detail Page State

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the product detail page reflects the correct state after a product has been added to the cart.

**Preconditions:** Product A has been added to the cart (qty 1).

**Steps:**

1. Click on Product A's name to navigate to its detail page.
2. Assert the product name on the detail page matches Product A.
3. Assert the "Add to Cart" button text reads `Add Another`.
4. Assert the quantity control shows `1`.

**Expected Result:** Product detail page shows the correct product name, button state, and quantity.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-09 — Add Additional Qty from Product Detail Page

**Spec:** `checkoutFlow.ts`

**Objective:** Verify that adding more quantity from the product detail page updates the cart badge correctly and the button briefly shows "Added!".

**Preconditions:** User is on Product A's detail page; cart badge shows `1`.

**Steps:**

1. Click increase qty twice — assert qty is `3`.
2. Click decrease qty once — assert qty is `2`.
3. Click "Add to Cart".
4. Assert the button text briefly changes to `Added!`.
5. Assert the cart badge count equals `3`.
6. Wait for the button text to revert to `Add Another`.

**Expected Result:** Cart is updated with the correct total quantity and the button shows the transient "Added!" confirmation before reverting.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-10 — Navigate Back to Products from Detail Page

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the back button on the product detail page returns the user to the products listing.

**Preconditions:** User is on a product detail page.

**Steps:**

1. Click the back to products button.
2. Assert the products page title equals `Products`.

**Expected Result:** User is returned to the products listing page.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-11 — Add Second Product with Custom Quantity

**Spec:** `checkoutFlow.ts`

**Objective:** Verify that setting a custom quantity and adding a second product correctly updates the cart badge.

**Preconditions:** User is on the products page; cart badge shows `3`.

**Steps:**

1. Set the quantity for Product B to `3` using the quantity controls.
2. Click "Add to Cart" for Product B.
3. Assert the cart badge count equals `6`.

**Expected Result:** Cart badge reflects the combined quantity of all added products.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-12 — Cart Item and Summary Validation

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the cart displays the correct items, quantities, unit prices, line totals, and order summary values.

**Preconditions:** Cart contains Product A (qty 3) and Product B (qty 3).

**Steps:**

1. Navigate to the cart page.
2. For each expected cart item:
   - Assert the item name is present.
   - Assert the unit price is correct.
   - Assert the quantity is correct.
   - Assert the line total equals unit price × quantity.
3. Assert the cart subtotal is correct.
4. Assert the tax amount is correct (8% of subtotal).
5. Assert the order total equals subtotal + tax.

**Expected Result:** All cart items and summary values are accurate.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-13 — Checkout Page Order Preview

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the checkout page shows a correct order preview before the shipping form is submitted.

**Preconditions:** User has clicked "Proceed to Checkout" from the cart.

**Steps:**

1. For each item in the order preview:
   - Assert the item name and quantity label is correct.
   - Assert the item total is correct.
2. Assert the preview total matches the expected order total.

**Expected Result:** Order preview on the checkout page accurately reflects the cart contents.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-14 — Shipping Form Submission

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the shipping form accepts valid input and proceeds to the order summary.

**Preconditions:** User is on the checkout page.

**Steps:**

1. Enter a valid first name.
2. Enter a valid last name.
3. Enter a valid postal code.
4. Click "Continue".
5. Assert the order summary page title reads `Order Summary`.

**Expected Result:** Form is submitted successfully and the user is taken to the order summary page.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-15 — Order Summary Validation

**Spec:** `checkoutFlow.ts`

**Objective:** Verify the order summary page displays the correct items, quantities, prices, and payment totals.

**Preconditions:** User has completed the shipping form and is on the order summary page.

**Steps:**

1. Assert the page title reads `Order Summary`.
2. For each order item:
   - Assert the item name is correct.
   - Assert the quantity and unit price label is correct (e.g. `Qty: 3 × $29.99`).
   - Assert the line subtotal is correct.
3. Assert the payment summary subtotal is correct.
4. Assert the tax amount is correct (8%).
5. Assert the total equals subtotal + tax.
6. Assert the shipping info contains the correct first name, last name, and postal code.

**Expected Result:** Order summary accurately reflects all items, pricing, and shipping details.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-16 — Order Confirmation

**Spec:** `checkoutFlow.ts`

**Objective:** Verify that completing the order shows the confirmation page and resets the cart.

**Preconditions:** User is on the order summary page with all details validated.

**Steps:**

1. Click "Finish".
2. Assert the confirmation page is displayed.
3. Assert the title reads `Order Placed!`.
4. Assert the confirmation message reads `Thank you for your purchase. Your order has been successfully submitted.`
5. Assert the cart badge is no longer visible.
6. Click "Continue Shopping".

**Expected Result:** Order is confirmed, cart is cleared, and the user can continue shopping.

**Runs for users:** `swift_tester`, `buggy_agent`, `mirage_user`

---

### TC-17 — Locked Out User Login

**Spec:** `login.vault_locked.ts`

**Objective:** Verify that a locked-out user cannot log in and is shown the correct error message.

**Preconditions:** Application is accessible; the `vault_locked` user account is locked out.

**Steps:**
1. Navigate to the login page.
2. Assert the browser tab title equals `QA Automation Assessment`.
3. Enter credentials for the `vault_locked` user.
4. Submit the login form.
5. Assert the error message reads `Epic sadface below — Sorry, this user has been locked out.`

**Expected Result:** Login is rejected and the locked-out error message is displayed. The user is not redirected to the products page.

---

## Test Coverage Summary

| TC    | Test Case                | Spec File                           | All 3 Users |
| ----- | ------------------------ | ----------------------------------- | :---------: |
| TC-01 | Page Title               | `accessPage.ts` / `checkoutFlow.ts` |     ✅      |
| TC-02 | Login                    | `checkoutFlow.ts`                   |     ✅      |
| TC-03 | Category Filter          | `checkoutFlow.ts`                   |     ✅      |
| TC-04 | Sort Filter              | `checkoutFlow.ts`                   |     ✅      |
| TC-05 | Initial Cart State       | `checkoutFlow.ts`                   |     ✅      |
| TC-06 | Quantity Controls        | `checkoutFlow.ts`                   |     ✅      |
| TC-07 | Add to Cart              | `checkoutFlow.ts`                   |     ✅      |
| TC-08 | Product Detail State     | `checkoutFlow.ts`                   |     ✅      |
| TC-09 | Add Qty from Detail Page | `checkoutFlow.ts`                   |     ✅      |
| TC-10 | Back to Products         | `checkoutFlow.ts`                   |     ✅      |
| TC-11 | Add Second Product       | `checkoutFlow.ts`                   |     ✅      |
| TC-12 | Cart Validation          | `checkoutFlow.ts`                   |     ✅      |
| TC-13 | Checkout Preview         | `checkoutFlow.ts`                   |     ✅      |
| TC-14 | Shipping Form            | `checkoutFlow.ts`                   |     ✅      |
| TC-15 | Order Summary            | `checkoutFlow.ts`                   |     ✅      |
| TC-16 | Order Confirmation       | `checkoutFlow.ts`                   |     ✅      |
| TC-17 | Locked Out User Login    | `login.vault_locked.ts`             |     N/A     |

---

## Page Objects

| Page               | File                       | Responsibility                                          |
| ------------------ | -------------------------- | ------------------------------------------------------- |
| Login              | `loginPage.ts`             | Login form and navigation                               |
| Products listing   | `productsPage.ts`          | Product cards, filters, sort, qty controls, add to cart |
| Product detail     | `productPage.ts`           | Product detail view, back button                        |
| Cart               | `cartPage.ts`              | Cart items, qty controls, summary, checkout navigation  |
| Checkout           | `checkoutPage.ts`          | Shipping form, order preview                            |
| Order summary      | `orderSummaryPage.ts`      | Order items, payment summary, shipping info, finish     |
| Order confirmation | `orderConfirmationPage.ts` | Success message, continue shopping                      |
| Shared header/nav  | `storePage.ts`             | Cart badge, cart icon, username display                 |

---

## Test Data

| File                   | Contents                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| `users.ts`             | Login credentials for `swift_tester`, `buggy_agent`, `mirage_user` |
| `products.ts`          | Product names and prices                                           |
| `productCategories.ts` | Category names and expected product counts                         |
| `sortOptions.ts`       | Sort option names, fields, and sort direction                      |
| `customers.ts`         | Shipping form data (first name, last name, postal code)            |
| `messages.ts`          | Expected UI text strings                                           |

