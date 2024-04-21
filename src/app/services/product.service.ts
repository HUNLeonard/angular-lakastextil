// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/compat/firestore';
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

  getAllProducts(): Observable<Product[]> {
    let query: AngularFirestoreCollection<Product>;
    query = this.productsCollection;
    
  
    return query.get().pipe(
      map(querySnapshot => {
        const products: Product[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          products.push({ id: doc.id, ...data } as Product);
        });
        return products;
      }),
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

  getAllProductsFiltered(
    searchText: string = '',
    priceRange?: { min?: number, max?: number },
    sortBy?: { field: string, order: 'asc' | 'desc' }
  ): Observable<Product[]> {
    let query: Query<Product> = this.productsCollection.ref;
  
  
    // Filter by price range
    if (priceRange?.min !== undefined) {
      query = query.where('price', '>=', priceRange.min);
    }
    if (priceRange?.max !== undefined) {
      query = query.where('price', '<=', priceRange.max);
    }
  
    // Sort by field and order
    if (sortBy?.field) {
      const orderBy = sortBy.order === 'asc' ? 'asc' : 'desc';
      query = query.orderBy(sortBy.field, orderBy);
    }
  
    return from(query.get()).pipe(
      map((querySnapshot) => {
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Product;
          if(searchText){
            const name = data.name.toLowerCase();
            let searchWords =searchText.trim().toLowerCase().split(' ');
            const matchesSearchWords = searchWords.every((word: string) => name.includes(word));
            if (matchesSearchWords) {
                products.push({ id: doc.id, ...data } as Product);
            }
          }
          else{
            products.push({ id: doc.id, ...data } as Product);
          }
        });
        return products;
      }),
      switchMap((products) =>
        forkJoin(
          products.map(async (product) => {
            const downloadURL = await this.getImageDownloadURL(product.image);
            return { ...product, image: downloadURL };
          })
        )
      ),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return from([]);
      })
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