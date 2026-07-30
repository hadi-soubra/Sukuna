import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { MenuSidebar } from '../../core/layout/menu-sidebar/menu-sidebar';
import { ProductService } from '../../shared/services/product.service';
import { CartStore } from '../../shared/services/cart.store';
import { IProduct } from '../../shared/interfaces/IProduct';
import { ProductCard } from '../../shared/components/product-card/product-card';

interface CartFlight {
  id: number;
  image: string;
  startX: number;
  startY: number;
  hopX: number;
  hopY: number;
  endX: number;
  endY: number;
}

@Component({
  selector: 'app-product',
  imports: [Header, StatusBar, CartDrawer, MenuSidebar, CurrencyPipe, UpperCasePipe, ProductCard],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly product = signal<IProduct | null>(null);
  protected readonly similarProducts = signal<IProduct[]>([]);
  protected readonly quantity = signal(1);
  protected readonly loading = signal(true);
  protected readonly cartFlights = signal<CartFlight[]>([]);

  protected readonly tilt = signal('');
  private readonly maxTilt = 8;
  private nextFlightId = 0;

  constructor() {
    // refetch whenever the :id in the URL changes (e.g. clicking a similar item)
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.quantity.set(1);
          this.similarProducts.set([]);
          return this.productService.getById(Number(params.get('id')));
        }),
        switchMap((product) =>
          this.productService.getByCategory(product.category).pipe(
            map((categoryProducts) => {
              const similarProducts = categoryProducts
                .filter((item) => item.id !== product.id)
                .slice(0, 4);

              return { product, similarProducts };
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ product, similarProducts }) => {
        this.product.set(product);
        this.similarProducts.set(similarProducts);
        this.loading.set(false);
      });
  }

  protected inc(): void {
    this.quantity.update((q) => q + 1);
  }
  protected dec(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  protected addToCart(event: MouseEvent): void {
    const p = this.product();
    if (!p) return;

    this.cart.add(p, this.quantity());
    this.launchCartFlight(event.currentTarget, p.image);
    this.cart.openCart();
  }

  protected finishCartFlight(id: number): void {
    this.cartFlights.update((flights) => flights.filter((flight) => flight.id !== id));
  }

  private launchCartFlight(origin: EventTarget | null, image: string): void {
    if (
      !(origin instanceof HTMLElement) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const originRect = origin.getBoundingClientRect();
    const startX = originRect.left + originRect.width / 2;
    const startY = originRect.top + originRect.height / 2;

    // The drawer is 400px wide (or 90vw on small screens). Aim at the first
    // product thumbnail inside it while the drawer slides into view.
    const drawerWidth = Math.min(400, window.innerWidth * 0.9);
    const targetX = window.innerWidth - drawerWidth + 48;
    const targetY = 94;
    const endX = targetX - startX;
    const endY = targetY - startY;

    this.cartFlights.update((flights) => [
      ...flights,
      {
        id: ++this.nextFlightId,
        image,
        startX,
        startY,
        hopX: endX * 0.58,
        hopY: Math.min(endY * 0.55 - 90, -120),
        endX,
        endY,
      },
    ]);
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
