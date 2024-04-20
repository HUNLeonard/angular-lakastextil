import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignComponent } from 'src/app/pages/sign/sign.component';
import { MainComponent } from 'src/app/pages/main/main.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { AccountComponent } from './pages/account/account.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'sign', component: SignComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
