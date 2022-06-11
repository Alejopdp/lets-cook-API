import { Order } from "../../domain/order/Order";

export enum RecipeSelectionState {
    ELIGIO = "Eligió",
    NO_ELIGE = "No Elige",
    AUN_NO_ELIGIO = "Aún no eligió",
    ELEGIDA_POR_LC = "Elegida por LC",
}
export interface OrdersWithRecipeSelectionExport {
    stripePaymentId: string;
    paymentOrderId: string | number;
    paymentOrderState: string;
    orderId: string | number;
    paymentOrderNumber: string | number;
    orderState: string;
    weekLabel: string;
    billingDate: string;
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
    recipeSku: string;
    numberOfPersons: number;
    numberOfRecipes: number;
    customerPreferredLanguage: string;
    chooseState: RecipeSelectionState | string;
    pricePlan: number;
    kitPrice: number;
    coupon: string;
    planDiscount: number;
    kitDiscount: number;
    finalPrice: number;
    finalKitPrice: number;
    finalPortionPrice: number;
    recipeDivision: number;
    recivedOrdersQuantity: number;
    deliveriesUntilWeek: number | string;
    onlyFirstWeek: boolean;
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
    billingName: string;
    "DNI / NIE / CIF": string;
    billingAddressName: string;
    billingAddressDetails: string;
    billingCity: string;
    billingProvince: string;
    billingZipCode: string;
    billingCountry: string;
    billingPhoneNumber: string;
    billingPhoneNumber2: string;
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
    "Fecha de nacimiento": string;
    "Idioma de preferencia": string;
    MGM: string;
    shopifyFirstDeliveryDate: Date | string;
}

export interface CancellationExport {
    customerId: string | number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    status: string;
    // shopifyCustomerId: string;
    // pastOrdersCount: number;
    // numberOfActiveSubscriptions: number;
    // numberOfSubscriptions: number;
    subscriptionId: string | number;
    subscriptionCreatedAt: Date;
    cancellationDate: Date | string;
    planTitle: string;
    planVariantTitle: string;
    cancellationReason: string;
    cancellationComment: string;
    User_or_admin: string;
    customerPhoneNumber1: string;
    customerPhoneNumber2: string;
    weeksQTY: number;
    active_subscriptions: number;
}

export interface CouponExport {
    coupon_id: string | number;
    couponCode: string;
    discount_type: string;
    discount_value: number;
    minimum_requirement_type: string;
    minimum_requirement_value: string | number;
    apply_to_type: string;
    apply_to_value: string;
    application_limit_type_1: string;
    application_limit_value_1: string | number;
    application_limit_type_2: string;
    application_limit_value_2: string | number;
    application_limit_type_3: string;
    application_limit_value_3: string | number;
    coupons_by_subscriptions_type: string;
    coupons_by_suscription_value: number;
    date_range_start: Date | string;
    date_range_expire: Date | string;
    state: string;
}

export interface ActionExport {
    date: string;
    action: string;
    user: string;
    role: string;
    "action type": string;
    "customer first name": string;
    "customer last name": string;
    "customer email": string;
}

export interface IExportService {
    parseCsvToJson(csvFilePath: string): string[][];
    exportSubscriptions(subscriptionsExport: SubscriptionExport[]): void;
    exportCustomers(customersExport: CustomerExport[]): void;
    exportCustomerActions(actionsExport: ActionExport[]): void;
    exportCancellations(cancellationExports: CancellationExport[]): void;
    exportCoupons(couponsExport: CouponExport[]): void;
    exportNextOrdersWithRecipesSelection(ordersWithRecipeSelectionExport: OrdersWithRecipeSelectionExport[]): void;
    exportAllCustomersActions(actionsExport: ActionExport[]): void;
}
