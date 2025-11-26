import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../types/cart-item';
import { Product } from '../types/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = computed(() => this._items());
  readonly count = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  add(product: Product, quantity = 1): void {
    this._items.update((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { product, quantity }];
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this._items.update((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  remove(productId: number): void {
    this._items.update((current) => current.filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this._items.set([]);
  }
}
