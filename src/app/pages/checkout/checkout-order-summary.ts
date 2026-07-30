import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartStore } from '../../shared/services/cart.store';

@Component({
  selector: 'app-checkout-order-summary',
  imports: [CurrencyPipe],
  templateUrl: './checkout-order-summary.html',
  styleUrl: './checkout-order-summary.scss',
})
export class CheckoutOrderSummary {
  protected readonly cart = inject(CartStore);
}
