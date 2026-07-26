import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { forkJoin, map, switchMap } from 'rxjs';
import { Header } from '../../core/layout/header/header';
import { StatusBar } from '../../core/layout/status-bar/status-bar';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/interfaces/IProduct';

interface CategorySection {
  category: string;
  products: IProduct[];
}

@Component({
  selector: 'app-shop',
  imports: [Header, StatusBar, ProductCard, UpperCasePipe],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sections = signal<CategorySection[]>([]);

  // "New Drops" = one featured product from each category
  protected readonly newDrops = computed(() =>
    this.sections()
      .map((s) => s.products[0])
      .filter((p): p is IProduct => !!p)
  );

  private readonly fullHeadline = 'Beautiful things,quietly made';
  protected readonly headline = signal('');
  protected readonly typingDone = signal(false);

  constructor() {
    // one section per category, showing the first 4 products (order preserved)
    this.productService
      .getCategories()
      .pipe(
        switchMap((categories) =>
          forkJoin(
            categories.map((category) =>
              this.productService
                .getByCategory(category)
                .pipe(map((products) => ({ category, products: products.slice(0, 4) })))
            )
          )
        )
      )
      .subscribe((sections) => this.sections.set(sections));

    let charCount = 0;
    const typingId = setInterval(() => {
      charCount++;
      this.headline.set(this.fullHeadline.slice(0, charCount));

      if (charCount >= this.fullHeadline.length) {
        clearInterval(typingId);
        this.typingDone.set(true);
      }
    }, 80);
    this.destroyRef.onDestroy(() => clearInterval(typingId));
  }
}
