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
}
