# Sukuna : Pages & Build Checklist

Working spec for the full front-end ecommerce build. Products come from the
[Fake Store API](https://fakestoreapi.com) (20 products, categories: electronics,
jewelery, men's clothing, women's clothing). Auth runs against the local dockerized
academy-api. Checkout is **simulated** (front-end only : no real orders/payments).




## 0. Shared / cross-cutting : build ONCE, reused everywhere

These are the foundation. Nothing below moves until these exist.

- [x] **`Product` interface** : id, title, price, description, category, image, rating {rate, count}
- [x] **`ProductService`** : treat Fake Store as a real DB: one live REST call per query, no bulk-cache. `getAll`, `getById`, `getCategories`, `getByCategory`. Returns Observables. (Price-sort/search aren't server-supported → done client-side on the returned list.)
- [x] **`CartStore`** (@ngrx/signals SignalStore) : `items` state; computed `count` + `total`; `add` / `updateQty` / `remove` / `clear`; persists to `localStorage` via an `effect`
- [x] **Shop header / nav** (`core/layout/header`) : terminal-token buttons — `[menu]` opens the sidebar (UiStore), centered `sukuna 店` logo → /shop, `[account]` → /account (hidden on mobile), `[cart]` opens the mini-cart drawer w/ live red count. Gold brackets always, label → gold on hover. (Search moved into the sidebar.) Gold bottom border, sticky top.
- [x] **Product card** (`shared/components/product-card`) : `product` input; paper tile w/ blended image, uppercased category tag, 2-line title, price (currency), ★ rating, `[ ADD TO CART ]` → CartStore.add. Links to /product/:id. Rendering in a grid on the Shop page.
- [x] **Terminal status-bar footer** (`core/layout/status-bar`) : red mode box (`mode` input, default SUDO), live route path `~/sukuna/...`, live clock, optional `info` slot, yellow `cart:N` box wired to CartStore. Fixed to viewport bottom.
- [x] **Collapsible cart drawer (mini-cart)** (`shared/components/cart-drawer`) : slides in from right; opened by header `[cart]`, closed by overlay / `[esc]` / Escape key; line items w/ qty ± and remove; subtotal, shipping (free >$100), total; `[CHECKOUT]` → /checkout + `[view full cart]` → /cart. Empty state. Reads CartStore `isOpen` + computeds.
- [x] **Menu sidebar** (`core/layout/menu-sidebar`) : slides from left, opened by header `[menu]` (UiStore); search input + category list w/ counts; account shown here on mobile only. (Full detail under §2.)
- [x] **Global `.btn`** (`styles.scss`) : one canonical red/black terminal button, straight edges — used by every CTA (login, add-to-cart, checkout…) so the style lives in one place.
- [x] **`UiStore`** (`shared/services/ui.store`) : menu-sidebar open state.
- [x] **`DropStatus`** (`shared/services/drop-status`) : root-singleton signals `status` + `dropDate`; **admin writes, gate reads**; persisted to `localStorage` and **synced across tabs** via the `storage` event.
- [ ] **Route guards** : protect authed pages; redirect to gate if not logged in
- [ ] **HTTP interceptor** : attach token to academy-api requests; handle 401 globally



## 1. Gate `/` : the drop landing (DropStatus-driven)  `[x]`

> Drop status + date are now **set from the admin dashboard** and reflected here live (same signal, cross-tab).

Single route; `@switch (dropStatus.status())` renders one of these. Already built.

- [x] **Teaser / Coming Soon** : pure-mystery, no countdown
- [x] **Coming Soon (countdown)** : intro w/ reveal
- [x] **Upcoming → Registration** : apply-form (FormBuilder, validators, password match)
- [x] **Live → Login** : login-form
- [x] **Ended** : drop-closed state
- [x] **Error messages** on invalid register (409 = email taken) / login (401 = bad creds) + loading state
- [x] After successful login, land on the storefront `/shop`



## 2. Home / storefront `/shop`  `[x]`  ← the home mockup

- [x] **Hero** : eyebrow (`$ /sukuna --season 2026`), big headline, JP subtitle, blurb
- [x] **New Drops** : featured product grid (subset of catalog, e.g. one per category)
- [x] **Menu sidebar** (`core/layout/menu-sidebar`, slides from left, opened by header `[menu]`, `UiStore` state) : search input + category list w/ counts (All, Electronics, Jewelry, Men, Women); category → `/shop/:category` (listing route pending). Account shown here on mobile only.
- [x] **Collapsible cart** : the mini-cart drawer (shared component)
- [x] Header + status-bar footer (shared)



## 3. Listing / category pages `/shop/:category`  `[x]`

One page, param-driven (a category or "all"). This is where filter/sort/search live.

- [x] **Product grid** of cards (`pages/listing`, `/shop/:category`; `:category` = api string or `all`)
- [x] **Sort** : price ↑/↓, rating, name (default name); gold-hover buttons. *(featured option removed per user)*
- [x] **Filter** : max-price range slider (ceiling = highest price in the set)
- [x] **Search** : live client-side title filter; also driven by the sidebar search via `?search=` query param
- [x] Category = server call (`getByCategory` / `getAll` for "all"); sort + price-filter + search = client-side computed pipeline over the returned list
- [x] **Empty state** : "no products match."
- Entry points wired: sidebar categories + "All", storefront `[ view all ]` buttons, sidebar search (Enter → `/shop/all?search=`)


## 4. Product detail `/product/:id`  `[x]`  ← the product mockup
> **Similar items** (rubric-required) was built then removed at your request — re-add before submission.

- [x] Large image, category tag, title, price, rating + review count, description
- [x] Quantity stepper + ADD TO CART (adds N to CartStore, opens mini-cart)
- [x] Trust line (free shipping / returns)
- [x] Reachable by clicking any product card anywhere (`/product/:id`)


## 5. Full cart page `/cart`  `[x]`

The full-page version of the drawer (same CartService).

- [x] Line items : image, title, unit price, qty stepper, remove, line total
- [x] Order summary : subtotal, shipping rule (free over $100), total
- [x] **CHECKOUT** button → `/checkout` (wired; the `/checkout` page itself is still pending)
- [x] **Empty cart state** : message + "browse the drop" link



## 6. Checkout flow `/checkout`  `[ ]`

Simulated : no real payment. A multi-step flow:

- [x] **Step 1 : Contact / shipping** : name, email, address (reactive form + validation)
- [x] **Step 2 : Payment** : card fields (fake; reuse a saved payment method from profile if present)
- [x] **Step 3 : Review** : order summary, place order
- [x] **Order confirmation / success** : order number, clear the cart : *the flow needs an endpoint screen; you didn't list this*
- [x] Guarded : redirect to gate if not logged in; redirect to `/cart` if cart empty



## 7. Account / profile `/account`  `[ ]`

Your "account page" : the rubric breaks it into three parts, so tabs/sections:

- [x] **User details** : read view of the logged-in user
- [x] **Edit profile details** : editable form
- [x] **Payment methods** : list + add + remove (signal + localStorage; no real backend) : *required by rubric*
- [x] **Logout**



## 8. Admin `[x]`  (guard pending)

- [x] **Admin login `/admin-login`** (`pages/admin/admin-login`) : standalone copy of the user login (own form / validators / error handling), same `auth/login` call, **role-gated** — only `user.role === 'admin'` proceeds to `/admin`; a valid non-admin login is signed back out with an error. Reached by typing the URL (kept separate from the gate, which may be in coming-soon/ended).
- [x] **Admin dashboard `/admin`** (`pages/admin/admin-page`) : tabbed, own chrome (centered logo bar + static footer w/ `[logout]`). Tabs:
  - **`[dashboard]`** : live **drop control** (Teaser/Upcoming/Live/Ended toggle + drop-date picker → writes `DropStatus`, gate reflects it live & cross-tab) · summary stat cards · "Sales this week" CSS bar chart · "Recent activity" feed (static/visual)
  - **`[products]`** : AG Grid v36 table from `prod.json`, dark-themed to the site, straight edges — image on red backdrop, name, category, **editable description** (double-click → popup; persists to `localStorage`), `$` price, gold/red in-stock pill
  - **`[users]`** : pending-applications page (invite-only queue) — applicant cards w/ name, email, 3 "vibe" image placeholders, **accept / reject** actions (removes from the queue), empty state
- [ ] Admin-only **route guard** — login enforces the role, but `/admin` itself isn't guarded against direct navigation yet



## 9. Utility  `[ ]`

- [ ] **404 / not-found** page
- [ ] Consistent loading + error UI across data fetches



## Route map (target)

| Path | Page | Auth |
||||
| `/` | Gate (teaser/register/login/ended) | public |
| `/shop` | Storefront home | authed |
| `/shop/:category` | Listing (filter/sort/search) | authed |
| `/product/:id` | Product detail (similar removed) | authed |
| `/cart` | Full cart | authed |
| `/checkout` | Checkout flow → confirmation | authed |
| `/account` | Profile / payment methods | authed |
| `/admin-login` | Admin login | public |
| `/admin` | Admin dashboard | admin |
| `**` | 404 | public |

