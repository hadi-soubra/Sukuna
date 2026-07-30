import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // only touch our academy-api — never the Fake Store (different host, no token)
  const isApi = req.url.startsWith(auth.baseURL);
  const token = auth.getToken();

  const authReq =
    isApi && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // expired / invalid session on an authed call → sign out (skip login/register 4xx)
      if (err.status === 401 && isApi && !req.url.includes('/auth/')) {
        auth.clearSession();
        router.navigate(['/']);
      }
      return throwError(() => err);
    })
  );
};
