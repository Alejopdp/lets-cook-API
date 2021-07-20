import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";

export interface AssignOrdersWithDifferentFreqToPaymentOrdersDto {
    orders: Order[];
    frequencyOrdersMap: { [frequency: string]: Order[] };
    frequencyWeeksMap: { [frequency: string]: Week[] };
    customerId: CustomerId;
    shippingCost: number;
}
