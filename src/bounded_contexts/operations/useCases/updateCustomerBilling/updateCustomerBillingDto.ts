export interface UpdateCustomerBillingDto {
    customerId: string;
    lat: number;
    long: number;
    addressName: string;
    details: string;
    customerName: string;
    billingId: string;
    identification: string;
    nameOrEmailOfAdminExecutingRequest: string | undefined;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}
