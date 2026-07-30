import { computed, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ICartItem } from '../../shared/interfaces/ICartItem';
import { IProduct } from '../../shared/interfaces/IProduct';
import { CartStore } from '../../shared/services/cart.store';
import { ProductService } from '../../shared/services/product.service';
import { Cart } from './cart';

const product: IProduct = {
  id: 7,
  title: 'Sukuna Test Jacket',
  price: 19.99,
  description: 'A product used to test the cart.',
  category: "men's clothing",
  image: '/test-jacket.png',
  rating: {
    rate: 4.8,
    count: 120,
  },
};

function createCartMock(initialItems: ICartItem[]) {
  const items = signal(initialItems);
  const isOpen = signal(false);
  const total = computed(() =>
    items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  const shipping = computed(() => (total() >= 100 || total() === 0 ? 0 : 10));

  return {
    items,
    isOpen,
    count: computed(() => items().reduce((sum, item) => sum + item.quantity, 0)),
    total,
    shipping,
    grandTotal: computed(() => total() + shipping()),
    updateQty: vi.fn((productId: number, quantity: number) => {
      items.update((currentItems) =>
        quantity <= 0
          ? currentItems.filter((item) => item.product.id !== productId)
          : currentItems.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item,
            ),
      );
    }),
    remove: vi.fn((productId: number) => {
      items.update((currentItems) => currentItems.filter((item) => item.product.id !== productId));
    }),
    openCart: vi.fn(() => isOpen.set(true)),
    closeCart: vi.fn(() => isOpen.set(false)),
  };
}

async function renderCart(quantity = 2) {
  const cart = createCartMock([{ product, quantity }]);

  await render(Cart, {
    providers: [
      provideRouter([]),
      { provide: CartStore, useValue: cart },
      {
        provide: ProductService,
        useValue: { getAll: () => of([]) },
      },
    ],
  });

  return {
    cart,
    user: userEvent.setup(),
  };
}

describe('Cart', () => {
  it('renders the cart items, quantity, and calculated total', async () => {
    await renderCart();

    expect(screen.getByRole('heading', { name: /cart \[2\]/i })).toBeTruthy();
    expect(screen.getByText('Sukuna Test Jacket')).toBeTruthy();
    expect(screen.getAllByText('$39.98')).toHaveLength(2);
    expect(screen.getByText('$49.98')).toBeTruthy();
    expect(screen.queryByText(/your cart is empty/i)).toBeNull();
  });

  it('increases an item quantity when the shopper clicks increase', async () => {
    const { cart, user } = await renderCart();

    await user.click(screen.getByRole('button', { name: 'increase' }));

    expect(cart.updateQty).toHaveBeenCalledWith(product.id, 3);
    expect(await screen.findAllByText('$59.97')).toHaveLength(2);
  });

  it('removes an item and shows the empty-cart message', async () => {
    const { cart, user } = await renderCart(1);

    await user.click(screen.getByRole('button', { name: 'remove' }));

    expect(cart.remove).toHaveBeenCalledWith(product.id);
    expect(await screen.findByText(/your cart is empty/i)).toBeTruthy();
    expect(screen.queryByText('Sukuna Test Jacket')).toBeNull();
  });

  it('links the checkout button to the checkout page', async () => {
    await renderCart();

    const checkoutLink = screen.getByRole('link', { name: /checkout/i });

    expect(checkoutLink.getAttribute('href')).toBe('/checkout');
  });
});
