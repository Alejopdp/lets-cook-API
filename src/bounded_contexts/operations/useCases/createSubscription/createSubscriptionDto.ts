import { Locale } from "../../domain/locale/Locale";

export interface CreateSubscriptionDto {
    customerId: string | number;
    planId: string | number;
    planVariantId: string | number;
    planFrequency: string;
    restrictionComment: string;
    stripePaymentMethodId: string;
    couponId?: string | number;
    paymentMethodId: string;
    addressName: string;
    addressDetails: string;
    latitude: number;
    longitude: number;
    customerFirstName: string;
    customerLastName: string;
    phone1: string;
    locale: Locale;
    shippingCity: string;
    shippingProvince: string;
    shippingPostalCode: string;
    shippingCountry: string;
}
