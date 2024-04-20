import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  randomProducts$: Observable<Product[]> | undefined;
  products$: Observable<Product[]> | undefined;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRandomProducts();
  }

  navigateToProductDetail(product: Product) {
    if (product.id) {
      this.router.navigate(['/product', product.id], { state: { product } });
    } else {
      // Handle the case where product.id is undefined
      console.error('Product ID is undefined. Cannot navigate to product detail.');
    }
  }

  getRandomProducts() {
    this.products$ = this.getAllProducts();
    this.randomProducts$ = this.products$.pipe(
      map((products) => products.sort(() => Math.random() - 0.5).slice(0, 8))
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.productService.getAllProducts();
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }
}