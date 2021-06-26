import { Order } from "../../domain/order/Order";

export class GetNextOrdersBySubscriptionPresenter {
    public static present(orders: Order[]): any {
        const presentedOrders = [];

        for (let order of orders) {
            presentedOrders.push({
                id: order.id.value,
                isSkipped: order.isSkipped(),
                minDay: order.week.minDay,
                maxDay: order.week.maxDay,
            });
        }

        return presentedOrders;
    }
}
