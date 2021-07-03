import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";

export interface AssignOrdersToPaymentOrdersDto {
    orders: Order[];
    customerId: CustomerId;
    subscription: Subscription;
    weeks: Week[];
    shippingCost: number;
}
