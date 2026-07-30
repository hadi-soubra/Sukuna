import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { MenuSidebar } from '../../core/layout/menu-sidebar/menu-sidebar';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { AuthService } from '../../core/auth/auth.service';
import { IUser } from '../../core/auth/IUser';

@Component({
  selector: 'app-account',
  imports: [Header, StatusBar, MenuSidebar, CartDrawer],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  // real user pulled from the API
  protected readonly user = signal<IUser | null>(null);

  // payment methods stay static / visual (cvv masked)
  protected readonly paymentMethods = [
    { brand: 'VISA', last4: '4242', expiry: '09/28' },
    { brand: 'MASTERCARD', last4: '5588', expiry: '11/27' },
  ];

  constructor() {
    this.auth
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => this.user.set(u),
        error: () => {},
      });
  }

  protected logout(): void {
    this.auth.logout();
  }
}
