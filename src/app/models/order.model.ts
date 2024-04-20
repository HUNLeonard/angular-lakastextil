export interface Order {
    id?: string;
    userId: string;
    products: OrderProduct[];
    total: number;
    purchaseDate: Date;
    estimatedDate:Date;
}
  
export interface OrderProduct {
    [productId: string]: {
      price: number;
      quantity:number;
    };
}