import {
  Component,
  DestroyRef,
  HostListener,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiStore } from '../../../shared/services/ui.store';
import { ProductService } from '../../../shared/services/product.service';

interface CategoryLink {
  label: string;
  count: number;
  link: string[];
}

// API category string -> short display label
const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Electronics',
  jewelery: 'Jewelry',
  "men's clothing": 'Men',
  "women's clothing": 'Women',
};

@Component({
  selector: 'app-menu-sidebar',
  imports: [RouterLink],
  templateUrl: './menu-sidebar.html',
  styleUrl: './menu-sidebar.scss',
})
export class MenuSidebar {
  protected readonly ui = inject(UiStore);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly categories = signal<CategoryLink[]>([]);
  protected readonly search = signal('');

  constructor() {
    // fetch the catalog once to build the category list + counts
    this.productService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        const links: CategoryLink[] = [
          { label: 'All', count: products.length, link: ['/shop'] },
        ];
        for (const [apiCat, label] of Object.entries(CATEGORY_LABELS)) {
          links.push({
            label,
            count: products.filter((p) => p.category === apiCat).length,
            link: ['/shop', apiCat],
          });
        }
        this.categories.set(links);
      });

    // lock page scroll while the menu is open
    effect(() => {
      document.body.style.overflow = this.ui.menuOpen() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
    });
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.ui.menuOpen()) {
      this.ui.closeMenu();
    }
  }
}
