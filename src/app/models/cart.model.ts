import { CartItem } from "./cartItem.model";

export interface Cart {
    userId?: string;
    products: CartItem[];
}
