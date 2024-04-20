import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { CartItem } from 'src/app/models/cartItem.model';
import { Product } from 'src/app/models/product.model';
import { ShippingData } from 'src/app/models/user-information.model';
import { Order, OrderProduct } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection('orders');
  }

  async createAndSaveOrder(
    cartItems: CartItem[],
    products: Product[],
    selectedShippingOption: { name: string; price: number },
    selectedShippingAddress: ShippingData,
    cartTotal: number
  ): Promise<void> {
    const userId = (await this.auth.currentUser)?.uid || '';

    const orderProducts: OrderProduct[] = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        [item.productId]: {
          price: product?.price || 0,
          quantity: item.quantity
        }
      };
    });

    const order: Order = {
      userId,
      products: orderProducts,
      total: parseFloat((cartTotal + selectedShippingOption.price).toFixed(2)),
      purchaseDate: new Date(),
      estimatedDate: this.getEstimatedDeliveryDate(selectedShippingOption.name)
    };
    console.log(order);
    await this.ordersCollection.add(order);
  }

  private getEstimatedDeliveryDate(shippingOptionName: string): Date {
    const today = new Date();
    switch (shippingOptionName) {
      case 'Same day':
        const sameDay = new Date(today.getTime() + 3600000); // Add 1 hour in milliseconds
        return sameDay;
      case '3 day':
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
      case '7 day':
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      default:
        return new Date();
    }
  }
}