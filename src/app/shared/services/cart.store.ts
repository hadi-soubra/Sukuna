import { computed, effect, inject } from '@angular/core';
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
import { AuthService } from '../../core/auth/auth.service';

const STORAGE_KEY = 'sukuna-carts';
const LEGACY_STORAGE_KEY = 'sukuna-cart';

type StoredCarts = Record<string, ICartItem[]>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function loadCarts(): StoredCarts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as StoredCarts)
      : {};
  } catch {
    return {};
  }
}

function loadCart(email: string): ICartItem[] {
  const cart = loadCarts()[normalizeEmail(email)];
  return Array.isArray(cart) ? cart : [];
}

function saveCart(email: string, items: ICartItem[]): void {
  const ownerEmail = normalizeEmail(email);
  if (!ownerEmail) return;

  try {
    const carts = loadCarts();

    if (items.length) {
      carts[ownerEmail] = items;
    } else {
      delete carts[ownerEmail];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts));
  } catch {
    // Keep the in-memory cart usable if browser storage is unavailable.
  }
}

function removeLegacyCart(): void {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Nothing else is needed when browser storage is unavailable.
  }
}

type CartState = {
  ownerEmail: string;
  items: ICartItem[];
  isOpen: boolean;
};

const initialState: CartState = {
  ownerEmail: '',
  items: [],
  isOpen: false,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // Derived state recompute automatically when items change.
  withComputed(({ items }) => {
    const total = computed(() => items().reduce((sum, i) => sum + i.product.price * i.quantity, 0));
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
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
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
        items: store.items().map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
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

  // Swap and persist carts whenever the authenticated account changes.
  withHooks((store) => {
    const auth = inject(AuthService);

    return {
      onInit() {
        removeLegacyCart();

        const syncOwner = () => {
          const ownerEmail = normalizeEmail(auth.currentUserEmail());
          if (ownerEmail === store.ownerEmail()) return;

          patchState(store, {
            ownerEmail,
            items: ownerEmail ? loadCart(ownerEmail) : [],
            isOpen: false,
          });
        };

        syncOwner();
        effect(syncOwner);

        effect(() => {
          saveCart(store.ownerEmail(), store.items());
        });
      },
    };
  }),
);
