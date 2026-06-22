# Bug Tracker

Bugs found during automation test runs. Each entry follows the format below.

---

## Bug Template

**ID:** BUG-XXX
**Title:** Short description of the bug
**Severity:** Critical / High / Medium / Low
**Status:** Open / In Progress / Resolved

**Environment:**
- User:
- Browser:
- Date Found:

**Test Case:** TC-XX — Test Case Name

**Description:**
A clear summary of what went wrong.

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should have happened.

**Actual Result:**
What actually happened.

**Notes / Evidence:**
Any additional context, screenshots, or error messages.

---

## Open Bugs

---

**ID:** BUG-001
**Title:** Sort by Price High–Low sorts products Low–High instead
**Severity:** High
**Status:** Open

**Environment:**
- User: `swift_tester`, `buggy_agent`, `mirage_user` (all users affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-04 — Sort Filter

**Description:**
When a user selects the "Price High–Low" sort option on the products page, the products are displayed in ascending price order (Low–High) instead of the expected descending order (High–Low).

**Steps to Reproduce:**
1. Log in with any valid user.
2. Navigate to the products page.
3. Select "All Categories" from the category filter.
4. Select "Price High–Low" from the sort dropdown.
5. Observe the order of products listed on the page.

**Expected Result:**
Products are sorted by price in descending order (highest price first).

**Actual Result:**
Products are sorted by price in ascending order (lowest price first), identical to the "Price Low–High" sort behaviour.

**Notes / Evidence:**
Reproduced across all three test users (`swift_tester`, `buggy_agent`, `mirage_user`). The TC-04 sort assertion fails for this option — the sorted values array does not match the descending order expectation.

---

---

**ID:** BUG-002
**Title:** Cart badge and cart contents not reset after order confirmation
**Severity:** High
**Status:** Open

**Environment:**
- User: `swift_tester`, `buggy_agent`, `mirage_user` (all users affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-16 — Order Confirmation

**Description:**
After a user completes checkout and lands on the order confirmation page, the cart badge still displays the item count from the completed order. Navigating to the cart also shows all the previously ordered items still present. The cart and cart badge should be fully cleared once an order is confirmed.

**Steps to Reproduce:**
1. Log in with any valid user.
2. Add products to the cart and complete the full checkout flow.
3. Click "Finish" on the order summary page.
4. Observe the cart badge on the order confirmation page.
5. Click the cart icon.
6. Observe the contents of the cart.

**Expected Result:**
- The cart badge is not visible on the order confirmation page.
- The cart is empty when opened after order confirmation.

**Actual Result:**
- The cart badge remains visible and displays the total item count from the completed order.
- Opening the cart shows all previously ordered items still in the cart.

**Notes / Evidence:**
Reproduced across all three test users (`swift_tester`, `buggy_agent`, `mirage_user`). The TC-16 assertion `isCartBadgeDisplayed() === false` fails. Cart state is not being cleared server-side or client-side upon order completion.

Clicking "Continue Shopping" on the confirmation page does correctly reset the cart badge and cart contents. The bug is specific to the confirmation page itself — the cart reset is triggered by navigation rather than by the order being placed, meaning the cart is only cleared as a side effect of leaving the page rather than on order completion.

---

**ID:** BUG-003
**Title:** "Bolt T-Shirt" cannot be added to cart — no feedback given to the user
**Severity:** High
**Status:** Open

**Environment:**
- User: `swift_tester`, `buggy_agent`, `mirage_user` (all users affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-07 — Add to Cart from Products Page

**Description:**
The "Bolt T-Shirt" product appears fully interactive — quantity controls work and the "Add to Cart" button is clickable — but clicking the button has no effect. The cart badge does not appear, no item is added, and no error or out-of-stock message is shown. The user receives no feedback to explain why the action failed.

**Steps to Reproduce:**
1. Log in with any valid user.
2. Navigate to the products page.
3. Locate the "Bolt T-Shirt" product.
4. Adjust the quantity using the increase/decrease controls (controls respond as expected).
5. Click "Add to Cart".
6. Observe the cart badge and the button state.

**Expected Result:**
Either:
- The product is added to the cart and the cart badge updates with the correct item count, **or**
- If the product is out of stock, an out-of-stock indicator (e.g. disabled button, "Out of Stock" label) is displayed so the user understands why it cannot be added.

**Actual Result:**
Clicking "Add to Cart" does nothing. The cart badge does not appear, the button state does not change, and no message is shown to the user.

**Notes / Evidence:**
Reproduced across all three test users. Quantity controls are functional, which gives the impression the product is available — making the silent failure particularly confusing. If the product is intentionally unavailable, the UI must communicate that clearly rather than allowing interaction with no result.

---

**ID:** BUG-004
**Title:** "Sauce Labs Onesie" product has incorrect data-test IDs — missing `sauce-labs-` prefix
**Severity:** Medium
**Status:** Open

**Environment:**
- User: `swift_tester`, `buggy_agent`, `mirage_user` (all users affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-06 — Quantity Controls on Products Page, TC-07 — Add to Cart from Products Page

**Description:**
The data-test IDs for the quantity controls and "Add to Cart" button on the "Sauce Labs Onesie" product card do not follow the naming convention used by all other products. The `sauce-labs-` prefix is missing, meaning the IDs use `onesie` as the product identifier instead of `sauce-labs-onesie`. This breaks the consistent pattern and will cause any automation selectors targeting this product by its full name to fail.

**Steps to Reproduce:**
1. Navigate to the products page.
2. Inspect the DOM for the "Sauce Labs Onesie" product card.
3. Observe the `data-test` attributes on the quantity decrease button, quantity value input, quantity increase button, and the "Add to Cart" button.

**Expected Result:**
Data-test IDs follow the full product name convention used by all other products:
- `qty-decrease-sauce-labs-onesie`
- `qty-value-sauce-labs-onesie`
- `qty-increase-sauce-labs-onesie`
- `add-to-cart-sauce-labs-onesie`

**Actual Result:**
Data-test IDs use a shortened product name, omitting the `sauce-labs-` prefix:
- `qty-decrease-onesie`
- `qty-value-onesie`
- `qty-increase-onesie`
- `add-to-cart-onesie`

**Notes / Evidence:**
All other products follow the full-name convention (e.g. `qty-decrease-sauce-labs-backpack`, `qty-decrease-sauce-labs-bike-light`). The "Sauce Labs Onesie" is the only product with truncated IDs. Any automation test that builds selectors dynamically from the product name will fail to locate this product's controls.

---

## Resolved Bugs

_No resolved bugs yet._
