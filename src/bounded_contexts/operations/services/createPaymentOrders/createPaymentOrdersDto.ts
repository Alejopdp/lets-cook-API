import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";

export interface CreatePaymentOrdersDto {
    orders: Order[];
    subscription: Subscription;
    shippingCost: number;
}
