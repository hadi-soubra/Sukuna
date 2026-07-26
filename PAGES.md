# Sukuna — Pages & Build Checklist

Working spec for the full front-end ecommerce build. Products come from the
[Fake Store API](https://fakestoreapi.com) (20 products, categories: electronics,
jewelery, men's clothing, women's clothing). Auth runs against the local dockerized
academy-api. Checkout is **simulated** (front-end only — no real orders/payments).


---

## 0. Shared / cross-cutting — build ONCE, reused everywhere

These are the foundation. Nothing below moves until these exist.

- [x] **`Product` interface** — id, title, price, description, category, image, rating {rate, count}
- [x] **`ProductService`** — treat Fake Store as a real DB: one live REST call per query, no bulk-cache. `getAll`, `getById`, `getCategories`, `getByCategory`. Returns Observables. (Price-sort/search aren't server-supported → done client-side on the returned list.)
- [ ] **`CartService`** — signal of line items {product, qty}; computed count + total; add / updateQty / remove / clear; persist to `localStorage`
- [ ] **Shop header / nav** (top bar in both mockups) — logo, search icon, account icon, cart icon w/ count badge, hamburger/menu. Shown on every shop page
- [ ] **Product card** — image, category tag, title, price, rating, ADD TO CART. Reused in home grid, listing pages, similar-items, admin
- [ ] **Collapsible cart drawer (mini-cart)** — the right sidebar in the home mockup; slides in/out; line items w/ qty +/− and remove, subtotal, shipping, total, CHECKOUT button
- [ ] **Route guards** — protect authed pages; redirect to gate if not logged in
- [ ] **HTTP interceptor** — attach token to academy-api requests; handle 401 globally
- [ ] **Cross-cutting states** — every data view needs loading + empty + error states

---

## 1. Gate `/` — the drop landing (DropStatus-driven)  `[~]`

Single route; `@switch (dropStatus.status())` renders one of these. Already built.

- [x] **Teaser / Coming Soon** — pure-mystery, no countdown
- [x] **Coming Soon (countdown)** — intro w/ reveal
- [x] **Upcoming → Registration** — apply-form (FormBuilder, validators, password match)
- [x] **Live → Login** — login-form
- [x] **Ended** — drop-closed state
- [x] **Error messages** on invalid register (409 = email taken) / login (401 = bad creds) + loading state
- [x] After successful login, land on the storefront `/shop`

---

## 2. Home / storefront `/shop`  `[ ]`  ← the home mockup

- [ ] **Hero** — eyebrow (`$ /sukuna --season 2026`), big headline, JP subtitle, blurb
- [ ] **New Drops** — featured product grid (subset of catalog, e.g. one per category)
- [ ] **Left sidebar** — search box + category list w/ counts (All, Electronics, Jewelry, Men, Women); clicking a category → listing page
- [ ] **Collapsible cart** — the mini-cart drawer (shared component)
- [ ] Header + status-bar footer (shared)

---

## 3. Listing / category pages `/shop/:category`  `[ ]`

One page, param-driven (a category or "all"). This is where filter/sort/search live.

- [ ] **Product grid** of cards for the active category
- [ ] **Sort** — price low→high, high→low, rating, name (your "price low-high" = sort)
- [ ] **Filter** — price range; (category is already the route). Filter = narrow, Sort = order — build both, they're different
- [ ] **Search** — query filters the grid live (also reachable from the header search icon) — *required by rubric*
- [ ] Category filter = server call (`getByCategory`); price-sort + search = client-side over the returned list (Fake Store can't sort by price or search server-side)
- [ ] **Empty state** — "no products match"

---

## 4. Product detail `/product/:id`  `[ ]`  ← the product mockup

- [ ] Large image, category tag, title, price, rating + review count, description
- [ ] Quantity stepper + ADD TO CART
- [ ] Trust line (free shipping / returns)
- [ ] **Similar items** — same category, minus this product — *required by rubric, not in your mockup yet*
- [ ] Reachable by clicking any product card anywhere

---

## 5. Full cart page `/cart`  `[ ]`

The full-page version of the drawer (same CartService).

- [ ] Line items — image, title, unit price, qty stepper, remove, line total
- [ ] Order summary — subtotal, shipping rule (free over $100), total
- [ ] **CHECKOUT** button → `/checkout`
- [ ] **Empty cart state** — message + "browse the drop" link

---

## 6. Checkout flow `/checkout`  `[ ]`

Simulated — no real payment. A multi-step flow:

- [ ] **Step 1 — Contact / shipping** — name, email, address (reactive form + validation)
- [ ] **Step 2 — Payment** — card fields (fake; reuse a saved payment method from profile if present)
- [ ] **Step 3 — Review** — order summary, place order
- [ ] **Order confirmation / success** — order number, clear the cart — *the flow needs an endpoint screen; you didn't list this*
- [ ] Guarded — redirect to gate if not logged in; redirect to `/cart` if cart empty

---

## 7. Account / profile `/account`  `[ ]`

Your "account page" — the rubric breaks it into three parts, so tabs/sections:

- [ ] **User details** — read view of the logged-in user
- [ ] **Edit profile details** — editable form
- [ ] **Payment methods** — list + add + remove (signal + localStorage; no real backend) — *required by rubric*
- [ ] **Logout**
- [ ] (Optional, nice) order history from simulated checkouts

---

## 8. Admin `[~]`

- [x] **Admin login `/admin-login`** — skeleton exists
- [ ] **Admin dashboard `/admin`** — **recent activity** feed (required) + summary stats (e.g. product/category counts, cart events). Since there's no real order backend, drive "recent activity" from events you log to localStorage (registrations, logins, cart adds, simulated checkouts)
- [ ] Admin-only guard

---

## 9. Utility  `[ ]`

- [ ] **404 / not-found** page
- [ ] Consistent loading + error UI across data fetches

---

## Route map (target)

| Path | Page | Auth |
|---|---|---|
| `/` | Gate (teaser/register/login/ended) | public |
| `/shop` | Storefront home | authed |
| `/shop/:category` | Listing (filter/sort/search) | authed |
| `/product/:id` | Product detail + similar | authed |
| `/cart` | Full cart | authed |
| `/checkout` | Checkout flow → confirmation | authed |
| `/account` | Profile / payment methods | authed |
| `/admin-login` | Admin login | public |
| `/admin` | Admin dashboard | admin |
| `**` | 404 | public |

---

## What you were missing (added above)

1. **Search** — you have filter/sort but not search; the rubric requires it and both mockups show a search box.
2. **Sort vs filter are two things** — "price low→high" is *sort*; the rubric wants filter (narrow) *and* sort (order).
3. **Similar / related items** on the product page — rubric-required, absent from your mockup.
4. **Payment methods + edit profile** — your "account page" is really three sections (details / edit / payment methods).
5. **Order confirmation screen** — your checkout flow needs an endpoint (success page + clear cart).
6. **Empty states** — empty cart, no-search-results.
7. **404 + loading/error states** — small, but they read as "finished."
8. **Guards + interceptor** — most shop pages should be login-gated.
