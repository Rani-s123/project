import { AsyncPipe, CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [NgIf, NgFor, AsyncPipe, CurrencyPipe, DecimalPipe],
  styleUrl: './admin-dashboard.component.scss',
  template: `
    <section class="admin">
      <div>
        <p class="eyebrow">Admin</p>
        <h2>Inventory snapshot</h2>
      </div>

      <ng-container *ngIf="products$ | async as products; else loading">
        <div class="stats">
          <div class="stat">
            <p>Total products</p>
            <strong>{{ products.length }}</strong>
          </div>
          <div class="stat">
            <p>Units in stock</p>
            <strong>{{ totalStock(products) }}</strong>
          </div>
          <div class="stat">
            <p>Avg price</p>
            <strong>{{ averagePrice(products) | number: '1.0-2' }}</strong>
          </div>
        </div>

        <div class="table">
          <div class="row head">
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Inventory</span>
          </div>
          <div class="row" *ngFor="let product of products">
            <span>{{ product.name }}</span>
            <span>{{ product.category }}</span>
            <span>{{ product.price | currency }}</span>
            <span>{{ product.inventory }}</span>
          </div>
        </div>
      </ng-container>

      <ng-template #loading>
        <div class="loading">Loading admin dashboard...</div>
      </ng-template>
    </section>
  `
})
export class AdminDashboardComponent {
  private readonly productService = inject(ProductService);

  protected readonly products$ = this.productService.getProducts();

  protected totalStock(products: Product[]): number {
    return products.reduce((sum, p) => sum + p.inventory, 0);
  }

  protected averagePrice(products: Product[]): number {
    const total = products.reduce((sum, p) => sum + p.price, 0);
    return total / Math.max(products.length, 1);
  }
}
