import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Shop } from './pages/shop/shop';
import { Product } from './pages/product/product';
import { Listing } from './pages/listing/listing';
import { Cart } from './pages/cart/cart';
import { Account } from './pages/account/account';
import { AdminLogin } from './pages/admin/admin-login/admin-login';
import { Checkout } from './pages/checkout/checkout';
import { checkoutAccessGuard } from './core/auth/checkout-access.guard';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'shop',
    component: Shop,
  },
  {
    path: 'product/:id',
    component: Product,
  },
  {
    path: 'shop/:category',
    component: Listing,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [checkoutAccessGuard],
  },
  {
    path: 'account',
    component: Account,
  },
  {
    path: 'admin-login',
    component: AdminLogin,
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-page/admin-page').then((module) => module.AdminPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((module) => module.NotFound),
  },
];
