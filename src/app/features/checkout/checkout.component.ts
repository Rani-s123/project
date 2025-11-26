import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, NgIf, NgFor, CurrencyPipe, RouterLink],
  styleUrl: './checkout.component.scss',
  template: `
    <section class="checkout">
      <form [formGroup]="checkoutForm" (ngSubmit)="submit()">
        <p class="eyebrow">Checkout</p>
        <h2>Secure your order</h2>

        <label>
          Full name
          <input formControlName="name" placeholder="Alex Doe" />
        </label>
        <label>
          Email
          <input formControlName="email" placeholder="you@example.com" />
        </label>
        <label>
          Address
          <input formControlName="address" placeholder="123 Market St" />
        </label>
        <label>
          City
          <input formControlName="city" placeholder="San Francisco" />
        </label>
        <label>
          Notes
          <textarea formControlName="notes" rows="3" placeholder="Delivery instructions"></textarea>
        </label>

        <button type="submit">Place order</button>

        <p class="success" *ngIf="submitted">Order placed! Cart cleared and ready for a new run.</p>
      </form>

      <aside class="summary">
        <p class="eyebrow">Order summary</p>
        <ng-container *ngIf="items().length; else empty">
          <div class="lines">
            <div class="line" *ngFor="let item of items()">
              <div>
                <p class="name">{{ item.product.name }}</p>
                <p class="muted small">{{ item.quantity }} × {{ item.product.price | currency }}</p>
              </div>
              <p class="amount">{{ item.product.price * item.quantity | currency }}</p>
            </div>
          </div>
          <div class="line total">
            <p>Total ({{ count() }} items)</p>
            <p class="amount">{{ total() | currency }}</p>
          </div>
          <a routerLink="/cart">Review cart</a>
        </ng-container>
        <ng-template #empty>
          <p class="muted">Your cart is empty.</p>
          <a routerLink="/products">Back to products</a>
        </ng-template>
      </aside>
    </section>
  `
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);

  protected readonly items = this.cartService.items;
  protected readonly total = this.cartService.total;
  protected readonly count = this.cartService.count;

  protected submitted = false;

  protected checkoutForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    notes: ['']
  });

  protected submit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.cartService.clear();
    this.submitted = true;
  }
}
