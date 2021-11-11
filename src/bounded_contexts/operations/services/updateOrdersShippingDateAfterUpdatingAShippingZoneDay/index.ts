import { mongooseOrderRepository } from "../../infra/repositories/order";
import { UpdateOrdersShippingDateAfterUpdatingAShippingZoneDay } from "./updateOrdersShippingDateAfterUpdatingAShippingZoneDay";

export const updateOrdersShippingDateAfterUpdatingAShippingZoneDay: UpdateOrdersShippingDateAfterUpdatingAShippingZoneDay =
    new UpdateOrdersShippingDateAfterUpdatingAShippingZoneDay(mongooseOrderRepository);
