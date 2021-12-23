import { Locale } from "../../domain/locale/Locale";

export interface UpdateSubscriptionCouponDto {
    subscriptionId: string;
    couponCode: string;
    customerId: string;
}
