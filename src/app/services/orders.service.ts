import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order, OrderProduct } from '../models/order.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
  ) {
    this.ordersCollection = this.afs.collection<Order>('orders');
  }

  getOrders(): Observable<Order[]> {
    return this.auth.authState.pipe(
      map((user) => user?.uid || ''),
      map((userId) =>
        this.ordersCollection.ref
          .where('userId', '==', userId)
          .orderBy('purchaseDate', 'desc')
          .get()
          .then((snapshot) => {
            return snapshot.docs.map((doc) => ({
              id: doc.id,
              userId: doc.data().userId,
              products: doc.data().products,
              total: doc.data().total,
              purchaseDate: (doc.data().purchaseDate as unknown as firebase.firestore.Timestamp).toDate(),
              estimatedDate: (doc.data().estimatedDate as unknown as firebase.firestore.Timestamp).toDate()
            }));
          })
      ),
      switchMap((promise) => from(promise))
    );
  }
}