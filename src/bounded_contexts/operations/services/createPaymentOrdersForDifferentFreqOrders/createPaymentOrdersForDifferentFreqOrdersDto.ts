import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";

export interface CreatePaymentOrdersForDifferentFreqOrdersDto {
    orders: Order[];
    customerId: CustomerId;
    shippingCost: number;
}
