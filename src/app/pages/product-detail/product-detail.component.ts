import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cartItem.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  cartItems: CartItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProductDetails();
    this.getCartItems();
  }

  getProductDetails() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.productService.getProductById(productId).subscribe(product => {
        this.product = product;
        this.isLoading = false;
      });
    });
  }

  getCartItems() {
    this.authService.getCurrentUserId().subscribe(async userId => {
      if (userId) {
        this.isLoggedIn = true;
        this.cartItems = await this.cartService.getCartItems();
      } else {
        this.isLoggedIn = false;
        this.cartItems = [];
      }
    });
  }

  async addToCart() {
    if (this.product) {
      const existingItem = this.cartItems.find(item => item.productId === this.product!.id);
      if (existingItem) {
        existingItem.quantity++;
        await this.cartService.updateCart(existingItem);
      } else {
        const newCartItem: CartItem = {
          productId: this.product.id!,
          quantity: 1
        };
        await this.cartService.updateCart(newCartItem);
        this.cartItems.push(newCartItem);
      }
    }
  }
}