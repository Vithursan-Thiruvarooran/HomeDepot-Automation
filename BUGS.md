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
**Title:** Multiple "Sauce Labs" products have incorrect data-test IDs — missing `sauce-labs-` prefix
**Severity:** Medium
**Status:** Open

**Environment:**
- User: `swift_tester`, `buggy_agent`, `mirage_user` (all users affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-06 — Quantity Controls on Products Page, TC-07 — Add to Cart from Products Page

**Description:**
The data-test IDs for the quantity controls and "Add to Cart" button on several "Sauce Labs" product cards are missing the `sauce-labs-` prefix. This breaks the naming convention followed by the rest of the product catalogue and causes any automation selectors built dynamically from the full product name to fail to locate these products' controls.

**Affected Products:**
- Sauce Labs Onesie
- Sauce Labs Backpack
- Sauce Labs Bike Light
- Sauce Labs Fleece Jacket

**Unaffected Products (correct IDs):**
- Sauce Labs Hoodie ✅
- Sauce Labs Mug ✅

**Steps to Reproduce:**
1. Navigate to the products page.
2. Inspect the DOM for each affected product card.
3. Observe the `data-test` attributes on the quantity decrease button, quantity value input, quantity increase button, and the "Add to Cart" button.

**Expected Result:**
Data-test IDs use the full product name, consistent with unaffected products. Examples:
- `qty-decrease-sauce-labs-onesie`
- `qty-value-sauce-labs-backpack`
- `qty-increase-sauce-labs-bike-light`
- `add-to-cart-sauce-labs-fleece-jacket`

**Actual Result:**
Data-test IDs omit the `sauce-labs-` prefix. Examples:
- `qty-decrease-onesie`
- `qty-value-backpack`
- `qty-increase-bike-light`
- `add-to-cart-fleece-jacket`

**Notes / Evidence:**
4 of the 6 "Sauce Labs" products are affected. "Sauce Labs Hoodie" and "Sauce Labs Mug" correctly include the `sauce-labs-` prefix. Any automation test that builds selectors dynamically from the full product name will fail to locate the controls for the four affected products.

---

**ID:** BUG-005
**Title:** `buggy_agent` user sees mismatched product images on the products listing page
**Severity:** Medium
**Status:** Open

**Environment:**
- User: `buggy_agent` (only this user affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-02 — Login, TC-08 — Product Detail Page State

**Description:**
When logged in as `buggy_agent`, the product images displayed on the products listing page do not match the product they are paired with. The product name, price, and other details are correct, but the images are mismatched across cards. Navigating to an individual product's detail page shows the correct image for that product.

**Steps to Reproduce:**
1. Log in as `buggy_agent`.
2. Navigate to the products page.
3. Observe the product images on the listing page — they do not correspond to the correct products.
4. Click on any product to navigate to its detail page.
5. Observe the product image on the detail page — it is correct.

**Expected Result:**
Product images on the listing page match the product name and details shown on the same card, consistent with what is displayed on the product detail page.

**Actual Result:**
Product images on the listing page are mismatched — each image appears to belong to a different product. The correct image is only shown once the user navigates to the product detail page.

**Notes / Evidence:**
Only reproduced for `buggy_agent`. The `swift_tester` and `mirage_user` accounts display correct images on the listing page. The issue appears to be specific to how product images are rendered on the listing page for this user, as the detail page correctly resolves the image.

---

**ID:** BUG-006
**Title:** "Test.allTheThings() T-Shirt" product name appears incorrect — likely a placeholder or corrupted value
**Severity:** Low
**Status:** Open

**Environment:**
- User: `swift_tester`, `buggy_agent`, `mirage_user` (all users affected)
- Browser: Chrome
- Date Found: 2026-06-22

**Test Case:** TC-03 — Category Filter, TC-07 — Add to Cart from Products Page

**Description:**
The product name "Test.allTheThings() T-Shirt" appears on the products listing page for all users. The name contains what looks like a test method invocation (`Test.allTheThings()`) rather than a real product name, suggesting it may be a placeholder, corrupted data, or a naming error. The expected product name is unknown but is likely something closer to "All The Things T-Shirt" or similar.

**Steps to Reproduce:**
1. Log in with any valid user.
2. Navigate to the products page.
3. Observe the product name "Test.allTheThings() T-Shirt" on the listing page.

**Expected Result:**
The product has a proper human-readable name (e.g. "All The Things T-Shirt") consistent with the naming conventions of other products in the catalogue.

**Actual Result:**
The product is displayed with the name "Test.allTheThings() T-Shirt", which contains a camelCase method-style invocation unlikely to be an intentional product name.

**Notes / Evidence:**
The correct product name is unconfirmed. The data-test ID for this product uses `all-the-things-t-shirt` (e.g. `add-to-cart-all-the-things-t-shirt`), which further suggests the display name is incorrect and the intended name is closer to "All The Things T-Shirt".

---

## Resolved Bugs

_No resolved bugs yet._
