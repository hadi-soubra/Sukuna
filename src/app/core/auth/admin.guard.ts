import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

// admin-only — token + verified role (survives refresh; currentUser is in-memory only)
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/admin-login']);
  }

  return auth.getProfile().pipe(
    map((user) =>
      user.role === 'admin' ? true : router.createUrlTree(['/admin-login'])
    ),
    // a 401 (expired token) is redirected globally by the interceptor
    catchError(() => of(false))
  );
};
