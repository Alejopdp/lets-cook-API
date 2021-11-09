import { Order } from "../../domain/order/Order";

export class MoveOrderShippingDatePresenter {
    public present(order: Order): any {
        return {
            shippingDate: order.getHumanShippmentDay(),
        };
    }
}
