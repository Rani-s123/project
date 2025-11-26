import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [NgIf, AsyncPipe, CurrencyPipe, RouterLink],
  styleUrl: './product-detail.component.scss',
  template: `
    <ng-container *ngIf="product$ | async as product; else loading">
      <section class="detail">
        <div class="media">
          <img [src]="product.image" [alt]="product.name" loading="lazy" />
        </div>
        <div class="info">
          <p class="category">{{ product.category }}</p>
          <h1>{{ product.name }}</h1>
          <p class="muted">{{ product.description }}</p>
          <div class="pricing">
            <span class="price">{{ product.price | currency }}</span>
            <span class="stock">{{ product.inventory }} in stock</span>
          </div>
          <div class="actions">
            <button (click)="addToCart(product)">Add to cart</button>
            <a routerLink="/products" class="link">Back to products</a>
          </div>
        </div>
      </section>
    </ng-container>

    <ng-template #loading>
      <div class="loading">Loading product...</div>
    </ng-template>
  `
})
export class ProductDetailComponent {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  readonly product$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.productService.getProduct(id))
  );

  protected addToCart(product: Product): void {
    this.cartService.add(product, 1);
  }
}
