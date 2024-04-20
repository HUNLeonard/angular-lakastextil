export interface UserInformation {
    username: string;
    email: string;
    shippingData: ShippingData;
}
  
export interface ShippingData {
    name: string;
    phoneNumber: number | any;
    zipCode: number | any;
    city: string;
    address: string;
}