import { Component, DestroyRef, HostListener, effect, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../services/cart.store';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawer {
  protected readonly cart = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // lock page scroll while the drawer is open
    effect(() => {
      document.body.style.overflow = this.cart.isOpen() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
    });
  }

  // [esc] closes the drawer
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.cart.isOpen()) {
      this.cart.closeCart();
    }
  }
}
