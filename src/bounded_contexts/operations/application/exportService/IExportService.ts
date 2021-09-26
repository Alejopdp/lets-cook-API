import { Order } from "../../domain/order/Order";

export enum RecipeSelectionState {
    ELIGIO = "Eligió",
    NO_ELIGE = "No Elige",
    AUN_NO_ELIGIO = "Aún no eligió",
    ELEGIDA_POR_LC = "Elegida por LC",
}
export interface OrdersWithRecipeSelectionExport {
    orderId: string | number;
    weekLabel: string;
    deliveryDate: string;
    customerPreferredShippingHour: string;
    customerId: string | number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    subscriptionDate: Date | string;
    recipeFormSubmissionDate: Date | string;
    recipeFormUpdateDate: Date | string;
    planId: string | number;
    planSku: string;
    planName: string;
    planVariantId: string | number;
    planVariantSku: string;
    planVariantDescription: string;
    subscriptionRestrictionComment: string;
    subscriptionRestriction: string;
    recipeVariantId: string | number;
    recipeVariantSku: string;
    recipeName: string;
    numberOfPersons: number;
    numberOfRecipes: number;
    customerPreferredLanguage: string;
    chooseState: RecipeSelectionState | string;
    pricePlan: number;
    kitPrice: number;
    planDiscount: number;
    kitDiscount: number;
    finalPrice: number;
    finalKitPrice: number;
    finalPortionPrice: number
}

export interface SubscriptionExport {
    customerId: string | number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    subscriptionId: string | number;
    subscriptionFrequency: string;
    subscriptionState: string;
    planId: string | number;
    planSku: string;
    planName: string;
    planVariantId: string | number;
    planVariantSku: string;
    planVariantDescription: string | number;
    price: string | number;
    billingFirstName: string;
    billingLastName: string;
    billingAddressName: string;
    billingAddressDetails: string;
    billingCity: string;
    billingProvince: string;
    billingZipCode: string;
    billingCountry: string;
    billingPhoneNumber: string;
    shippingAddressName: string;
    shippingAddressDetails: string;
    shippingAddressCity: string;
    shippingAddressProvince: string;
    shippingAddressZipCode: string;
    shippingCountry: string;
    shippingUpdateDate: string;
    discountCode: string;
    shippingZone: string;
    shippingDay: string;
    customerPreferredShippingHour: string;
    subscriptionRestriction: string;
    subscriptionRestrictionComment: string;
    customerPrefferedLanguage: string;
}
export interface CustomerExport {
    customerId: string | number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    createdAt: string;
    status: string;
    billingFirstName: string;
    billingLastName: string;
    billingAddressName: string;
    billingAddressDetails: string;
    billingCity: string;
    billingProvince: string;
    billingZipCode: string;
    billingCountry: string;
    billingPhoneNumber: string;
    shippingAddressName: string;
    shippingAddressDetails: string;
    shippingAddressCity: string;
    shippingAddressProvince: string;
    shippingAddressZipCode: string;
    shippingCountry: string;
    shopifyCustomerId: string;
    pastOrdersCount: number;
    numberOfActiveSubscriptions: number;
    numberOfSubscriptions: number;
}

export interface CancellationExport {
    customerId: string | number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    createdAt: string;
    status: string;
    shopifyCustomerId: string;
    pastOrdersCount: number;
    numberOfActiveSubscriptions: number;
    numberOfSubscriptions: number;
    subscriptionId: string | number;
    subscriptionCreatedAt: string;
    cancellationDate: string;
    planTitle: string;
    planVariantTitle: string;
    cancellationReason: string;
    cancellationComment: string;
}

export interface CouponExport {
    couponId: string | number;
    couponCode: string;
    discount_type: string;
    discount_value: string;
    minimum_requirement_type: string;
    minimum_requirement_value: string | number;
    appy_to_value: string;
    application_limit_type_1: string;
    application_limit_value_1: string | number;
    application_limit_type_2: string;
    application_limit_value_2: string | number;
    application_limit_type_3: string;
    application_limit_value_3: string | number;
    coupons_by_subscriptions_type: string;
    coupons_by_suscription_value: number;
    date_range_start: string;
    date_range_expire: string;
    state: string;
}

export interface IExportService {
    exportSubscriptions(subscriptionsExport: SubscriptionExport[]): void;
    exportCustomers(customersExport: CustomerExport[]): void;
    exportCancellations(cancellationExports: CancellationExport[]): void;
    exportCoupons(couponsExport: CouponExport[]): void;
    exportNextOrdersWithRecipesSelection(ordersWithRecipeSelectionExport: OrdersWithRecipeSelectionExport[]): void;
}
