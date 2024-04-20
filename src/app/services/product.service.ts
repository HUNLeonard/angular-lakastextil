// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private firestore: AngularFirestore) {
    this.productsCollection = this.firestore.collection<Product>('products');
  }

  getAllProducts(searchText: string = ''): Observable<Product[]> {
    let query: AngularFirestoreCollection<Product>;

    if (searchText) {
      const searchWords = searchText.trim().toLowerCase().split(' ');
      query = this.firestore.collection<Product>('products', ref =>
        ref.where('name', 'array-contains-any', searchWords)
      );
    } else {
      query = this.productsCollection;
    }

    return query.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const { id } = a.payload.doc;
          return { id, name: data.name, price: data.price, description: data.description, image: data.image } as Product;
        })
      ),
      switchMap(products =>
        forkJoin(
          products.map(async product => {
            const downloadURL = await this.getImageDownloadURL(product.image);
            return { ...product, image: downloadURL };
          })
        )
      )
    );
  }
  
  getProductsByDocumentIds(productIds: string[]): Observable<Product[]> {
    //console.log(productIds);
    const productObservables = productIds.map((productId) =>
      this.getProductById(productId),

    );
    return forkJoin(productObservables);
  }

  getProductById(productId: string): Observable<Product> {
    return this.productsCollection.doc(productId).get().pipe(
      map(doc => {
        if (doc.exists) {
          const data = doc.data() as Product;
          return { id: doc.id, ...data };
        } else {
          throw new Error(`Document with ID ${productId} not found`);
        }
      }),
      switchMap(product => this.getProductImageDownloadUrl(product)),
      catchError(error => {
        console.error('Error fetching product:', error);
        return from([]);
      })
    );
  }

  private getProductImageDownloadUrl(product: Product): Observable<Product> {
    return from(this.getImageDownloadURL(product.image)).pipe(
      map(downloadURL => ({
        ...product,
        image: downloadURL
      }))
    );
  }

  private async getImageDownloadURL(imageName: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, `${imageName}`);
    return await getDownloadURL(imageRef);
  }
}