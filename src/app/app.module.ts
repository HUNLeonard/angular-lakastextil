import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from 'src/environment/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SignComponent } from './pages/sign/sign.component';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipDirective } from './shared/directives/tooltip.directive';
import { HighlightDirective } from './shared/directives/highlight.directive';
import { MainComponent } from './pages/main/main.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './shared/product/product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartDropdownComponent } from './shared/cart-dropdown/cart-dropdown.component';
import { CartComponent } from './pages/cart/cart.component';
import { AccountComponent } from './pages/account/account.component';
import { OrdersComponent } from './pages/orders/orders.component';

import { PriceFormatterPipe } from './pipes/price-formatter.pipe';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomErrorHandlerService } from './services/custom-error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignComponent,
    TooltipDirective,
    HighlightDirective,
    MainComponent,
    ProductsComponent,
    ProductComponent,
    ProductDetailComponent,
    CartDropdownComponent,
    CartComponent,
    AccountComponent,
    OrdersComponent,
    PriceFormatterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTooltipModule
  ],
  providers: [
    SignComponent,
    AccountComponent,
    { provide: ErrorHandler, useClass: CustomErrorHandlerService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*
Attribute Directives
<!-- Example usage in a product card component -->
<div class="product-card" appHighlight="lightgray" appTooltip="This is a product tooltip">
  <!-- Product content -->
</div>
*/

/*
Structural Directives

<!-- Example usage in a product list component -->
<div *ngIf="products.length > 0">
  <h2>Products</h2>
  <div *ngFor="let product of products">
    <!-- Product card template -->
  </div>
</div>
<div *ngIf="products.length === 0">
  <p>No products available.</p>
</div>


<!-- Example usage in a product list component -->
<div *ngFor="let product of products">
  <div class="product-card" appHighlight="lightgray" appTooltip="This is a product tooltip">
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p>Price: {{ product.price }}</p>
    <button>Add to Cart</button>
  </div>
</div>
*/