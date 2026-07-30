import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../core/auth/auth.service';
import { ICartItem } from '../interfaces/ICartItem';
import { IProduct } from '../interfaces/IProduct';
import { CartStore } from './cart.store';

const firstProduct: IProduct = {
  id: 1,
  title: 'First account product',
  price: 20,
  description: 'First cart item',
  category: 'test',
  image: '/first.png',
  rating: { rate: 5, count: 1 },
};

const secondProduct: IProduct = {
  id: 2,
  title: 'Second account product',
  price: 30,
  description: 'Second cart item',
  category: 'test',
  image: '/second.png',
  rating: { rate: 4, count: 1 },
};

describe('CartStore account isolation', () => {
  const storedValues = new Map<string, string>();
  const activeEmail = signal('first@example.com');

  const storageMock: Storage = {
    get length() {
      return storedValues.size;
    },
    clear: vi.fn(() => storedValues.clear()),
    getItem: vi.fn((key: string) => storedValues.get(key) ?? null),
    key: vi.fn((index: number) => [...storedValues.keys()][index] ?? null),
    removeItem: vi.fn((key: string) => storedValues.delete(key)),
    setItem: vi.fn((key: string, value: string) => storedValues.set(key, value)),
  };

  beforeEach(() => {
    storedValues.clear();
    activeEmail.set('first@example.com');
    vi.stubGlobal('localStorage', storageMock);

    const firstCart: ICartItem[] = [{ product: firstProduct, quantity: 1 }];
    const secondCart: ICartItem[] = [{ product: secondProduct, quantity: 2 }];

    storedValues.set(
      'sukuna-carts',
      JSON.stringify({
        'first@example.com': firstCart,
        'second@example.com': secondCart,
      }),
    );
    storedValues.set('sukuna-cart', JSON.stringify(firstCart));

    TestBed.configureTestingModule({
      providers: [
        CartStore,
        {
          provide: AuthService,
          useValue: { currentUserEmail: activeEmail },
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('loads only the cart matching the active email and preserves the other account', () => {
    const cart = TestBed.inject(CartStore);
    TestBed.flushEffects();

    expect(cart.ownerEmail()).toBe('first@example.com');
    expect(cart.items()).toEqual([{ product: firstProduct, quantity: 1 }]);
    expect(localStorage.getItem('sukuna-cart')).toBeNull();

    activeEmail.set('second@example.com');
    TestBed.flushEffects();

    expect(cart.ownerEmail()).toBe('second@example.com');
    expect(cart.items()).toEqual([{ product: secondProduct, quantity: 2 }]);

    cart.updateQty(secondProduct.id, 3);
    TestBed.flushEffects();

    const savedCarts = JSON.parse(localStorage.getItem('sukuna-carts') ?? '{}') as Record<
      string,
      ICartItem[]
    >;

    expect(savedCarts['first@example.com']).toEqual([{ product: firstProduct, quantity: 1 }]);
    expect(savedCarts['second@example.com']).toEqual([{ product: secondProduct, quantity: 3 }]);
  });

  it('hides all cart items after logout without deleting the saved account cart', () => {
    const cart = TestBed.inject(CartStore);
    TestBed.flushEffects();

    activeEmail.set('');
    TestBed.flushEffects();

    expect(cart.ownerEmail()).toBe('');
    expect(cart.items()).toEqual([]);

    const savedCarts = JSON.parse(localStorage.getItem('sukuna-carts') ?? '{}') as Record<
      string,
      ICartItem[]
    >;
    expect(savedCarts['first@example.com']).toHaveLength(1);
  });
});
