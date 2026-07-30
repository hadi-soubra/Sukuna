import { Routes } from '@angular/router';
import { checkoutAccessGuard } from './core/auth/checkout-access.guard';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((module) => module.Login),
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop').then((module) => module.Shop),
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product').then((module) => module.Product),
    canActivate: [authGuard],
  },
  {
    path: 'shop/:category',
    loadComponent: () => import('./pages/listing/listing').then((module) => module.Listing),
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((module) => module.Cart),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then((module) => module.Checkout),
    canActivate: [checkoutAccessGuard],
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then((module) => module.Account),
    canActivate: [authGuard],
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./pages/admin/admin-login/admin-login').then((module) => module.AdminLogin),
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-page/admin-page').then((module) => module.AdminPage),
    canActivate: [adminGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((module) => module.NotFound),
  },
];
