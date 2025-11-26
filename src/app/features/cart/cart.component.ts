import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../types/cart-item';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule, RouterLink],
  styleUrl: './cart.component.scss',
  template: `
    <section class="cart" *ngIf="items().length; else empty">
      <div class="list">
        <article class="item" *ngFor="let item of items(); trackBy: trackById">
          <img [src]="item.product.image" [alt]="item.product.name" loading="lazy" />
          <div class="info">
            <p class="name">{{ item.product.name }}</p>
            <p class="muted">{{ item.product.category }}</p>
            <p class="price">{{ item.product.price | currency }}</p>
          </div>

          <div class="quantity">
            <label>Qty</label>
            <input
              type="number"
              min="1"
              [ngModel]="item.quantity"
              (ngModelChange)="updateQuantity(item.product.id, $event)"
            />
          </div>

          <div class="subtotal">{{ item.product.price * item.quantity | currency }}</div>
          <button class="ghost" type="button" (click)="remove(item.product.id)">Remove</button>
        </article>
      </div>

      <aside class="summary">
        <p class="eyebrow">Cart summary</p>
        <h3>{{ count() }} items</h3>
        <p>Total: <strong>{{ total() | currency }}</strong></p>
        <a routerLink="/checkout" class="primary">Proceed to checkout</a>
      </aside>
    </section>

    <ng-template #empty>
      <div class="empty">
        <p>Your cart is empty. Add something you love.</p>
        <a routerLink="/products">Browse products</a>
      </div>
    </ng-template>
  `
})
export class CartComponent {
  private readonly cart = inject(CartService);

  protected readonly items = this.cart.items;
  protected readonly count = this.cart.count;
  protected readonly total = this.cart.total;

  protected updateQuantity(productId: number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  protected remove(productId: number): void {
    this.cart.remove(productId);
  }

  protected trackById(_index: number, item: CartItem): number {
    return item.product.id;
  }
}
