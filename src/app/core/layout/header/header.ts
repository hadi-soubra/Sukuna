import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../shared/services/cart.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly cart = inject(CartStore);

  // fired by the hamburger — parent opens the category sidebar (built later)
  readonly menu = output<void>();
  // fired by the search icon — parent opens search (built later)
  readonly search = output<void>();
}
