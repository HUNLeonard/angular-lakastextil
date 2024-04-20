// src/app/shared/product/product.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cartItem.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() product: Product | undefined;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  cartItems: CartItem[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.getCartItems();
  }

  ngOnInit() {
    if (!this.product) {
      this.isLoading = true;
    } else {
      this.isLoading = false;
    }
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

  async addToCart(event: Event) {
    event.stopPropagation();
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