import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { UserInformationService } from 'src/app/services/user-information.service';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';
import { CartItem } from 'src/app/models/cartItem.model';
import { Product } from 'src/app/models/product.model';
import { UserInformation, ShippingData } from 'src/app/models/user-information.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  isLoading: boolean = true;
  cartTotal: number = 0;
  shippingOptions = [
    { name: 'Same day', price: 20 },
    { name: '3 day', price: 10 },
    { name: '7 day', price: 5 }
  ];
  selectedShippingOption: { name: string; price: number } | null = null;
  selectedShippingAddress: ShippingData | null = null;
  userInformation: UserInformation | null = null;
  newShippingData: ShippingData = {
    name: '',
    phoneNumber: null,
    zipCode: null,
    city: '',
    address: ''
  };
  useDefaultAddress: boolean = false;
  canPurchase: any = false;

  constructor(
    private cartService: CartService,
    private userInformationService: UserInformationService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.getCartItems();
    this.getUserInformation();
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

  selectShippingAddress(useDefault: boolean) {
    this.useDefaultAddress = useDefault;
    this.checkPurchaseConditions();
  }

  getUserInformation() {
    this.userInformationService.getUserInformation().subscribe((userInformation) => {
      this.userInformation = userInformation;
      this.selectedShippingAddress = userInformation?.shippingData || null;
    });
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
    this.checkPurchaseConditions();
  }

  async incrementQuantity(item: CartItem) {
    await this.cartService.incrementQuantity(item);
    await this.getCartItems();
    this.checkPurchaseConditions();
  }

  async deleteItem(item: CartItem) {
    await this.cartService.deleteItem(item);
    await this.getCartItems();
    this.checkPurchaseConditions();
  }

  selectShippingOption(option: { name: string; price: number } | null) {
    this.selectedShippingOption = option;
    this.updateCartTotal();
    this.checkPurchaseConditions();
  }

  async saveNewShippingData() {
    if (this.userInformation) {
      const updatedUserInformation = {
        ...this.userInformation,
        shippingData: this.newShippingData
      };
      await this.userInformationService.saveUserInformation(updatedUserInformation);
      this.selectedShippingAddress = this.newShippingData;
      this.useDefaultAddress = true;
      this.checkPurchaseConditions();
    }
  }

  getEstimatedDeliveryDate(): Date {
    const today = new Date();
    switch (this.selectedShippingOption?.name) {
      case 'Same day':
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
      case '3 day':
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
      case '7 day':
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      default:
        return new Date();
    }
  }

  getCartItemQuantity(productId: string): number {
    const item = this.cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  isDefaultAddressValid(): any {
    return (
      this.selectedShippingAddress?.name &&
      this.selectedShippingAddress?.phoneNumber &&
      this.selectedShippingAddress?.zipCode &&
      this.selectedShippingAddress?.city &&
      this.selectedShippingAddress?.address
    );
  }

  checkPurchaseConditions() {
    this.canPurchase =
      this.cartItems.length > 0 &&
      this.selectedShippingOption !== null &&
      (this.useDefaultAddress ? this.isDefaultAddressValid() !== null : (this.newShippingData.name !== '' && this.newShippingData.address !== '' && this.newShippingData.city !== '' && this.newShippingData.zipCode !== null && this.newShippingData.phoneNumber !== null));
  }

  getPurchaseErrorMessage(): string {
    if (this.cartItems.length === 0) {
      return 'Your cart is empty. Please add items to your cart before purchasing.';
    }
    if (this.selectedShippingOption === null) {
      return 'Please select a shipping option.';
    }
    if (this.selectedShippingAddress === null && !this.useDefaultAddress) {
      return 'Please provide a shipping address.';
    }
    if (!this.useDefaultAddress && (!this.newShippingData.name || !this.newShippingData.address || !this.newShippingData.city || !this.newShippingData.zipCode || !this.newShippingData.phoneNumber)) {
      return 'Please fill in all required shipping address fields.';
    }
    return '';
  }

  async purchase() {
    
    if (this.canPurchase) {
      try {
        if (this.selectedShippingOption && this.selectedShippingAddress) {
          await this.orderService.createAndSaveOrder(
            this.cartItems,
            this.products,
            this.selectedShippingOption,
            this.selectedShippingAddress,
            this.cartTotal
          );
  
          // Clear the cart
          await this.cartService.clearCart();
  
          // Navigate to the root route
          this.router.navigate(['/']);
        }
      } catch (error) {
        console.error('Error saving order:', error);
      }
    } else {
      // Do nothing, the error message will be displayed inline
    }
  }
}