export interface createCustomerDto {
    name: string;
    lastName: string;
    email: string;
    phone1: string;
    phone2: string;
    birthDate: Date;
    preferredLanguage: string;
    latShipping: number;
    longShipping: number;
    address: string;
    addressDetails: string;
    addressPreferredSchedule: string;
    latBilling: number;
    longBilling: number;
    billingAddressName: string;
    billingDetails: string;
    customerName: string;
    identification: string;
    state: string;
}
