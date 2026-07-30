import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, tap } from 'rxjs';
import { IUser } from './IUser';

const ACTIVE_EMAIL_KEY = 'sukuna-active-user-email';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly baseURL = '/api/';
  readonly tokenkey = 'token';
  readonly currentUserEmail = signal('');

  currentUser: IUser | undefined;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly cookieService: CookieService,
  ) {
    if (this.getToken()) {
      this.currentUserEmail.set(this.loadStoredEmail());
    } else {
      this.removeStoredEmail();
    }
  }

  getToken(): string {
    return this.cookieService.get(this.tokenkey);
  }

  setToken(token: string): void {
    this.cookieService.set(this.tokenkey, token, { path: '/', expires: 7 });
  }

  register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
  }): Observable<string | undefined> {
    const body = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      dateOfBirth: payload.dateOfBirth,
      username: payload.email,
      role: 'user',
    };

    return this.http
      .post<{ token: string; user: IUser }>(`${this.baseURL}auth/register`, body)
      .pipe(
        tap((response) => this.setSession(response.user, response.token)),
        map((response) => response.token),
      );
  }

  authenticate(email: string, password: string): Observable<string | undefined> {
    return this.http
      .post<{ token: string; user: IUser }>(`${this.baseURL}auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => this.setSession(response.user, response.token)),
        map((response) => response.token),
      );
  }

  // Current user from the token (the auth interceptor attaches the bearer header).
  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseURL}user`).pipe(tap((user) => this.rememberUser(user)));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Clear the active identity without deleting any account's saved cart.
  clearSession(): void {
    this.cookieService.delete(this.tokenkey, '/');
    this.currentUser = undefined;
    this.currentUserEmail.set('');
    this.removeStoredEmail();
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  private setSession(user: IUser, token: string): void {
    if (!token) return;

    this.setToken(token);
    this.rememberUser(user);
  }

  private rememberUser(user: IUser): void {
    const email = user.email.trim().toLowerCase();
    this.currentUser = user;
    this.currentUserEmail.set(email);

    try {
      localStorage.setItem(ACTIVE_EMAIL_KEY, email);
    } catch {
      // The in-memory identity still works if browser storage is unavailable.
    }
  }

  private loadStoredEmail(): string {
    try {
      return (localStorage.getItem(ACTIVE_EMAIL_KEY) ?? '').trim().toLowerCase();
    } catch {
      return '';
    }
  }

  private removeStoredEmail(): void {
    try {
      localStorage.removeItem(ACTIVE_EMAIL_KEY);
    } catch {
      // Nothing else is needed when browser storage is unavailable.
    }
  }
}
