export interface UpdateCustomerShippingDto {
    customerId: string;
    lat: number;
    long: number;
    name: string;
    fullName: string;
    details: string;
    addressId: string;
    deliveryTime: string;
    nameOrEmailOfAdminExecutingRequest?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}
