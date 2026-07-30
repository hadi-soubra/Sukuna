import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { MenuSidebar } from '../../core/layout/menu-sidebar/menu-sidebar';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/interfaces/IProduct';

type SortKey = 'name' | 'price-asc' | 'price-desc' | 'rating';

// API category string (or 'all') -> short display label
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  electronics: 'Electronics',
  jewelery: 'Jewelry',
  "men's clothing": 'Men',
  "women's clothing": 'Women',
};

@Component({
  selector: 'app-listing',
  imports: [Header, StatusBar, CartDrawer, MenuSidebar, ProductCard],
  templateUrl: './listing.html',
  styleUrl: './listing.scss',
})
export class Listing {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly category = signal('all');
  protected readonly products = signal<IProduct[]>([]);
  protected readonly loading = signal(true);

  // filter / sort / search state
  protected readonly searchQuery = signal('');
  protected readonly sortBy = signal<SortKey>('name');
  protected readonly maxPrice = signal(0);

  protected readonly sortOptions = [
    { key: 'name', label: 'name' },
    { key: 'rating', label: 'rating' },
    { key: 'price-asc', label: 'price ↑' },
    { key: 'price-desc', label: 'price ↓' },
  ] as const;

  protected readonly categoryLabel = computed(
    () => CATEGORY_LABELS[this.category()] ?? this.category(),
  );

  // slider ceiling = highest price in the loaded set
  protected readonly priceCeiling = computed(() => {
    const prices = this.products().map((p) => p.price);
    return prices.length ? Math.ceil(Math.max(...prices)) : 0;
  });

  // the pipeline: search -> price filter -> sort (all client-side)
  protected readonly visible = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const max = this.maxPrice();
    const list = this.products().filter(
      (p) => p.price <= max && (!q || p.title.toLowerCase().includes(q)),
    );
    return this.sortList(list, this.sortBy());
  });

  constructor() {
    // Keep sidebar searches in sync even when Angular reuses this page and
    // only the ?search= query parameter changes.
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => this.searchQuery.set(params.get('search') ?? ''));

    // refetch whenever the :category changes
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          const cat = params.get('category') ?? 'all';
          this.category.set(cat);
          return cat === 'all'
            ? this.productService.getAll()
            : this.productService.getByCategory(cat);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((products) => {
        this.products.set(products);
        // reset the price filter to include the whole (new) range
        const ceiling = products.length ? Math.ceil(Math.max(...products.map((p) => p.price))) : 0;
        this.maxPrice.set(ceiling);
        this.loading.set(false);
      });
  }

  private sortList(list: IProduct[], key: SortKey): IProduct[] {
    const arr = [...list];
    switch (key) {
      case 'price-asc':
        return arr.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return arr.sort((a, b) => b.price - a.price);
      case 'rating':
        return arr.sort((a, b) => b.rating.rate - a.rating.rate);
      case 'name':
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return arr;
    }
  }

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
  protected onMaxPrice(event: Event): void {
    this.maxPrice.set(Number((event.target as HTMLInputElement).value));
  }
  protected setSort(key: SortKey): void {
    this.sortBy.set(key);
  }
}
