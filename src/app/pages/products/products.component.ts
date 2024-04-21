// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]> | undefined;
  product: Product | undefined;
  searchText: string = '';
  priceRange: { min?: number, max?: number } = {};
  sortBy: { field: string, order: 'asc' | 'desc' } = { field: '', order: 'asc' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchText = params['search'] || '';
      this.getProducts();
    });
  }

  navigateToProductDetail(product: Product) {
    if (product.id) {
      this.router.navigate(['/product', product.id], { state: { product } });
    } else {
      // Handle the case where product.id is undefined
      console.error('Product ID is undefined. Cannot navigate to product detail.');
    }
  }

  resetFilters() {
    this.searchText = '';
    this.priceRange = {};
    this.sortBy = { field: '', order: 'asc' };
    this.getProducts();
  }

  getProducts() {
    this.products$ = this.productService.getAllProductsFiltered(this.searchText, this.priceRange, this.sortBy);
  }
}