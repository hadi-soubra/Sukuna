import { computed, effect } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { IProduct } from '../interfaces/IProduct';
import { ICartItem } from '../interfaces/ICartItem';

const STORAGE_KEY = 'sukuna-cart';

// Read the saved cart on startup. try/catch guards bad JSON or no localStorage.
function loadCart(): ICartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ICartItem[]) : [];
  } catch {
    return [];
  }
}

type CartState = { items: ICartItem[]; isOpen: boolean };

const initialState: CartState = { items: loadCart(), isOpen: false };

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // Derived state recompute automatically when items change.
  withComputed(({ items }) => {
    const total = computed(() =>
      items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    );
    // free shipping over $100 (and on an empty cart), otherwise a flat $10
    const shipping = computed(() => (total() >= 100 || total() === 0 ? 0 : 10));
    return {
      count: computed(() => items().reduce((sum, i) => sum + i.quantity, 0)),
      total,
      shipping,
      grandTotal: computed(() => total() + shipping()),
    };
  }),

  withMethods((store) => ({
    // Add a product, or bump its quantity if already in the cart.
    add(product: IProduct, quantity = 1): void {
      const items = store.items();
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        patchState(store, {
          items: items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        });
      } else {
        patchState(store, { items: [...items, { product, quantity }] });
      }
    },

    // Set an exact quantity; a quantity of 0 or less removes the line.
    updateQty(productId: number, quantity: number): void {
      if (quantity <= 0) {
        patchState(store, {
          items: store.items().filter((i) => i.product.id !== productId),
        });
        return;
      }
      patchState(store, {
        items: store
          .items()
          .map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
      });
    },

    remove(productId: number): void {
      patchState(store, {
        items: store.items().filter((i) => i.product.id !== productId),
      });
    },

    clear(): void {
      patchState(store, { items: [] });
    },

    // drawer open/close
    openCart(): void {
      patchState(store, { isOpen: true });
    },
    closeCart(): void {
      patchState(store, { isOpen: false });
    },
    toggleCart(): void {
      patchState(store, { isOpen: !store.isOpen() });
    },
  })),

  // Persist the cart to localStorage on every change.
  withHooks({
    onInit(store) {
      effect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store.items()));
      });
    },
  })
);
