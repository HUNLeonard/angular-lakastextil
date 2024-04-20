import { Component, OnInit } from '@angular/core';
import { Order, OrderProduct } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  products: Product[] = [];

  constructor(
    private ordersService: OrdersService,
     private productService: ProductService,
     private router: Router,
    ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  navigateTo(product: any){
    this.router.navigate(['/product', product.id], { state: { product } });
  }

  onOrderClick(order: Order): void {
    if (this.selectedOrder === order) {
      this.selectedOrder = null;
    } else {
      this.selectedOrder = order;
      this.getOrderProducts(order);
    }
  }
  getProductPrice(orderProduct: OrderProduct): number {
    return Object.values(orderProduct)[0].price | 0;
  }
  
  getProductQuantity(orderProduct: OrderProduct): number {
    return Object.values(orderProduct)[0].quantity | 0;
  }

  getOrderProducts(order: Order): void {
    this.products = [];
    const productIds: string[] = order.products.map((obj: OrderProduct) => Object.keys(obj)[0]);
    //console.log(productIds);

    this.productService.getProductsByDocumentIds(productIds).subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = [];
      }
    );
  }
}