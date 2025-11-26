import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [NgFor, NgIf, AsyncPipe, CurrencyPipe, RouterLink],
  styleUrl: './product-list.component.scss',
  template: `
    <section class="hero">
      <div>
        <p class="eyebrow">Headphone studio</p>
        <h1>Minimal, comfy, and tuned for focus.</h1>
        <p class="muted">
          Eight curated headphones across wireless, ANC, and studio fits. Choose your pair, add in one click, and check out fast.
        </p>
        <div class="cta-row">
          <a class="pill" routerLink="/cart">Cart: {{ cart.count() }} items | {{ cart.total() | currency }}</a>
          <a class="link" routerLink="/checkout">Go to checkout</a>
        </div>
      </div>
      <div class="panel">
        <p class="muted small">Live cart</p>
        <p class="kpi">{{ cart.total() | currency }}</p>
        <p class="muted">Across {{ cart.count() }} items</p>
        <a class="link" routerLink="/cart">View cart</a>
      </div>
    </section>

    <section class="highlights">
      <div class="highlight-card">
        <p class="eyebrow">Wireless & ANC</p>
        <h3>Quiet and cordless</h3>
        <p class="muted">
          Hybrid ANC, low-latency modes, and long battery for commutes and deep work.
        </p>
      </div>
      <div class="highlight-card">
        <p class="eyebrow">Studio & wired</p>
        <h3>Clarity and control</h3>
        <p class="muted">
          Monitors and DJ-ready sets with balanced tuning and sturdy builds.
        </p>
      </div>
      <div class="highlight-card">
        <p class="eyebrow">Travel & kids</p>
        <h3>Packable comfort</h3>
        <p class="muted">
          Foldable designs, safe volume limits, and lightweight fits on the go.
        </p>
      </div>
    </section>

    <section class="grid" *ngIf="products$ | async as products; else loading">
      <article class="card" *ngFor="let product of products; trackBy: trackById">
        <div class="preview">
          <img [src]="product.image" [alt]="product.name" loading="lazy" />
        </div>
        <div class="body">
          <p class="category">{{ product.category }}</p>
          <h2>{{ product.name }}</h2>
          <p class="muted">{{ product.description }}</p>
        </div>
        <div class="meta">
          <span class="price">{{ product.price | currency }}</span>
          <span class="stock">{{ product.inventory }} in stock</span>
        </div>
        <div class="actions">
          <button class="ghost" [routerLink]="['/products', product.id]">Details</button>
          <button (click)="addToCart(product)">Add to cart</button>
        </div>
      </article>
    </section>

    <ng-template #loading>
      <div class="loading">Loading products...</div>
    </ng-template>
  `
})
export class ProductListComponent {
  protected readonly cart = inject(CartService);
  private readonly productService = inject(ProductService);

  protected readonly products$ = this.productService.getProducts();

  protected addToCart(product: Product): void {
    this.cart.add(product, 1);
  }

  protected trackById(_index: number, product: Product): number {
    return product.id;
  }
}
