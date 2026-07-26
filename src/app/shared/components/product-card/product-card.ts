import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces/IProduct';
import { CartStore } from '../../services/cart.store';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  private readonly cart = inject(CartStore);

  readonly product = input.required<IProduct>();

  protected addToCart(): void {
    this.cart.add(this.product());
  }
}
