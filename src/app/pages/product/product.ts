import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { MenuSidebar } from '../../core/layout/menu-sidebar/menu-sidebar';
import { ProductService } from '../../shared/services/product.service';
import { CartStore } from '../../shared/services/cart.store';
import { IProduct } from '../../shared/interfaces/IProduct';

@Component({
  selector: 'app-product',
  imports: [
    Header,
    StatusBar,
    CartDrawer,
    MenuSidebar,
    CurrencyPipe,
    UpperCasePipe,
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly product = signal<IProduct | null>(null);
  protected readonly quantity = signal(1);
  protected readonly loading = signal(true);

  protected readonly tilt = signal('');
  private readonly maxTilt = 8;

  constructor() {
    // refetch whenever the :id in the URL changes (e.g. clicking a similar item)
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.quantity.set(1);
          return this.productService.getById(Number(params.get('id')));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((product) => {
        this.product.set(product);
        this.loading.set(false);
      });
  }

  protected inc(): void {
    this.quantity.update((q) => q + 1);
  }
  protected dec(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p, this.quantity());
    this.cart.openCart();
  }

  // mouse-tracking 3D tilt for the product image
  protected onTilt(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 2 * this.maxTilt;
    const rotateX = -(py - 0.5) * 2 * this.maxTilt;
    this.tilt.set(`perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  }
  protected resetTilt(): void {
    this.tilt.set('');
  }
}
