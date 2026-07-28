## What this is

A personal practice project to learn Angular properly  a frontend-only ecommerce site, built by hand, feature by feature, instead of cloned or copy-pasted. This file locks in the scope and vision before writing any code, so scope doesn't drift once things get moving.

## Concept

Not a generic ecommerce demo. The brand concept is a **limited-drop label**  think a streetwear/sneaker-style brand where products release in small, time-boxed batches rather than sitting in permanent stock. The UI and product experience should eventually reflect that (scarcity, drop framing, hype/release energy), even if the first implementation pass just covers core ecommerce mechanics.

## Stack

- **Framework:** Angular
- **Data source:** [Fake Store API](https://fakestoreapi.com)
- **Design:** Figma mockups (already drafted, kept outside this repo)
- **Scope:** Frontend only  no real backend, no real payments, no real auth

## Feature scope

### User features
- Product category listing
- Filter and sort product list
- Single product view (must show similar/related items)
- Search across products
- Cart: add items, update cart, delete cart
- User profile
  - User details
  - Payment methods
  - Edit profile details

### Admin features
- Dashboard showing recent activity

## Out of scope (for now)

Anything not listed above  real auth, real payments, order fulfillment, notifications, etc.  is out of scope until it's explicitly added to this file.
