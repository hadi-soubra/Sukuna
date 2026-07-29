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
- [x] **Shop header / nav** (`core/layout/header`) : hamburger (emits `menu`), centered `sukuna 店` logo → /shop, search icon (emits `search`), account → /account, cart → /cart w/ live red count badge (CartStore). Inline SVGs, gold bottom border, sticky top.
- [x] **Product card** (`shared/components/product-card`) : `product` input; paper tile w/ blended image, uppercased category tag, 2-line title, price (currency), ★ rating, `[ ADD TO CART ]` → CartStore.add. Links to /product/:id. Rendering in a grid on the Shop page.
- [x] **Terminal status-bar footer** (`core/layout/status-bar`) : red mode box (`mode` input, default SUDO), live route path `~/sukuna/...`, live clock, optional `info` slot, yellow `cart:N` box wired to CartStore. Fixed to viewport bottom.
- [x] **Collapsible cart drawer (mini-cart)** (`shared/components/cart-drawer`) : slides in from right; opened by header `[cart]`, closed by overlay / `[esc]` / Escape key; line items w/ qty ± and remove; subtotal, shipping (free >$100), total; CHECKOUT (placeholder). Empty state. Reads CartStore `isOpen` + computeds.
- [ ] **Route guards** : protect authed pages; redirect to gate if not logged in
- [ ] **HTTP interceptor** : attach token to academy-api requests; handle 401 globally
- [ ] **Cross-cutting states** : every data view needs loading + empty + error states



## 1. Gate `/` : the drop landing (DropStatus-driven)  `[~]`

Single route; `@switch (dropStatus.status())` renders one of these. Already built.

- [x] **Teaser / Coming Soon** : pure-mystery, no countdown
- [x] **Coming Soon (countdown)** : intro w/ reveal
- [x] **Upcoming → Registration** : apply-form (FormBuilder, validators, password match)
- [x] **Live → Login** : login-form
- [x] **Ended** : drop-closed state
- [x] **Error messages** on invalid register (409 = email taken) / login (401 = bad creds) + loading state
- [x] After successful login, land on the storefront `/shop`



## 2. Home / storefront `/shop`  `[ ]`  ← the home mockup

- [x] **Hero** : eyebrow (`$ /sukuna --season 2026`), big headline, JP subtitle, blurb
- [x] **New Drops** : featured product grid (subset of catalog, e.g. one per category)
- [x] **Menu sidebar** (`core/layout/menu-sidebar`, slides from left, opened by header `[menu]`, `UiStore` state) : search input + category list w/ counts (All, Electronics, Jewelry, Men, Women); category → `/shop/:category` (listing route pending). Account shown here on mobile only.
- [x] **Collapsible cart** : the mini-cart drawer (shared component)
- [x] Header + status-bar footer (shared)



## 3. Listing / category pages `/shop/:category`  `[ ]`

One page, param-driven (a category or "all"). This is where filter/sort/search live.

- [x] **Product grid** of cards (`pages/listing`, `/shop/:category`; `:category` = api string or `all`)
- [x] **Sort** — price ↑/↓, rating, name (default name); gold-hover buttons. *(featured option removed per user)*
- [x] **Filter** — max-price range slider (ceiling = highest price in the set)
- [x] **Search** — live client-side title filter; also driven by the sidebar search via `?search=` query param
- [x] Category = server call (`getByCategory` / `getAll` for "all"); sort + price-filter + search = client-side computed pipeline over the returned list
- [x] **Empty state** — "no products match."
- Entry points wired: sidebar categories + "All", storefront `[ view all ]` buttons, sidebar search (Enter → `/shop/all?search=`)


## 4. Product detail `/product/:id`  `[ ]`  ← the product mockup

- [x] Large image, category tag, title, price, rating + review count, description
- [x] Quantity stepper + ADD TO CART (adds N to CartStore, opens mini-cart)
- [x] Trust line (free shipping / returns)
- [x] Reachable by clicking any product card anywhere (`/product/:id`)


## 5. Full cart page `/cart`  `[ ]`

The full-page version of the drawer (same CartService).

- [x] Line items : image, title, unit price, qty stepper, remove, line total
- [x] Order summary : subtotal, shipping rule (free over $100), total
- [ ] **CHECKOUT** button → `/checkout`
- [x] **Empty cart state** : message + "browse the drop" link



## 6. Checkout flow `/checkout`  `[ ]`

Simulated : no real payment. A multi-step flow:

- [ ] **Step 1 : Contact / shipping** : name, email, address (reactive form + validation)
- [ ] **Step 2 : Payment** : card fields (fake; reuse a saved payment method from profile if present)
- [ ] **Step 3 : Review** : order summary, place order
- [ ] **Order confirmation / success** : order number, clear the cart : *the flow needs an endpoint screen; you didn't list this*
- [ ] Guarded : redirect to gate if not logged in; redirect to `/cart` if cart empty



## 7. Account / profile `/account`  `[ ]`

Your "account page" : the rubric breaks it into three parts, so tabs/sections:

- [ ] **User details** : read view of the logged-in user
- [ ] **Edit profile details** : editable form
- [ ] **Payment methods** : list + add + remove (signal + localStorage; no real backend) : *required by rubric*
- [ ] **Logout**
- [ ] (Optional, nice) order history from simulated checkouts



## 8. Admin `[~]`

- [x] **Admin login `/admin-login`** : skeleton exists
- [ ] **Admin dashboard `/admin`** : **recent activity** feed (required) + summary stats (e.g. product/category counts, cart events). Since there's no real order backend, drive "recent activity" from events you log to localStorage (registrations, logins, cart adds, simulated checkouts)
- [ ] Admin-only guard



## 9. Utility  `[ ]`

- [ ] **404 / not-found** page
- [ ] Consistent loading + error UI across data fetches



## Route map (target)

| Path | Page | Auth |
||||
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

