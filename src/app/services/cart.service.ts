import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Cart } from 'src/app/models/cart.model';
import { CartItem } from 'src/app/models/cartItem.model';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) {}

  async getCartItems(): Promise<CartItem[]> {
    const user = await this.auth.currentUser;
    if (user) {
      const cartDoc = this.firestore.doc<Cart>(`carts/${user.uid}`);
      const cartSnapshot = await cartDoc.get().toPromise();
      const cart = cartSnapshot?.data();
      return cart?.products ? cart.products : [];
    }
    return [];
  }

  async updateCart(cartItem: CartItem): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      const cartDoc = this.firestore.doc<Cart>(`carts/${user.uid}`);
      const cartSnapshot = await cartDoc.get().toPromise();
  
      if (cartSnapshot?.exists) {
        const cart = (cartSnapshot.data() as Cart) || { products: [] };
        const existingItemIndex = cart.products.findIndex(item => item.productId === cartItem.productId);
        if (existingItemIndex !== -1) {
          cart.products[existingItemIndex] = cartItem;
        } else {
          cart.products.push(cartItem);
        }
        await cartDoc.update({ products: cart.products });
      } else {
        // If the cart document doesn't exist, create a new one
        await cartDoc.set({ products: [cartItem] });
      }
    }
  }

  async decrementQuantity(cartItem: CartItem): Promise<void> {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      await this.updateCart(cartItem);
    } else {
      await this.deleteItem(cartItem);
    }
  }

  async incrementQuantity(cartItem: CartItem): Promise<void> {
    cartItem.quantity++;
    await this.updateCart(cartItem);
  }

  async deleteItem(cartItem: CartItem): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      const cartDoc = this.firestore.doc<Cart>(`carts/${user.uid}`);
      const cartSnapshot = await cartDoc.get().toPromise();
      const cart = cartSnapshot?.data() as Cart;
      const updatedProducts = cart.products.filter(item => item.productId !== cartItem.productId);
      await cartDoc.update({ products: updatedProducts });
    }
  }

  async clearCart(): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      const cartDoc = this.firestore.doc<Cart>(`carts/${user.uid}`);
      await cartDoc.update({ products: [] });
    }
  }
}