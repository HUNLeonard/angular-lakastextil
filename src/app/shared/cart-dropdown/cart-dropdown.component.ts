import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/models/cartItem.model';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-cart-dropdown',
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css']
})
export class CartDropdownComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  isLoading: boolean = true;
  cartTotal: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) { }

  async ngOnInit() {
    await this.getCartItems();
    if (this.products.length === 0) {
      this.isLoading = false;
    }
  }

  async getCartItems() {
    this.isLoading = true;
    this.cartItems = await this.cartService.getCartItems();
    this.getProductsForCartItems();
  }

  getProductsForCartItems() {
    const productIds = this.cartItems.map(item => item.productId);
    this.productService.getProductsByDocumentIds(productIds).subscribe(
      (products) => {
        this.products = products;
        this.updateCartTotal();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    );
  }

  updateCartTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => {
      const product = this.products.find(p => p.id === item.productId);
      return total + (product!.price * item.quantity || 0);
    }, 0);
  }

  async decrementQuantity(item: CartItem) {
    await this.cartService.decrementQuantity(item);
    await this.getCartItems();
  }

  async incrementQuantity(item: CartItem) {
    await this.cartService.incrementQuantity(item);
    await this.getCartItems();
  }

  async deleteItem(item: CartItem) {
    await this.cartService.deleteItem(item);
    await this.getCartItems();
  }

  getCartItemQuantity(productId: string): number {
    const item = this.cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }
}