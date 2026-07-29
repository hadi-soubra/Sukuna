import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { MenuSidebar } from '../../core/layout/menu-sidebar/menu-sidebar';
import { CartStore } from '../../shared/services/cart.store';

@Component({
  selector: 'app-cart',
  imports: [Header, StatusBar, CartDrawer, MenuSidebar, RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  protected readonly cart = inject(CartStore);
}
