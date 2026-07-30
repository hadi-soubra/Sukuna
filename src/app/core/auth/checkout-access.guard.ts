import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CartStore } from '../../shared/services/cart.store';

export const checkoutAccessGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const cart = inject(CartStore);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  if (cart.items().length === 0) {
    return router.createUrlTree(['/cart']);
  }

  return true;
};
