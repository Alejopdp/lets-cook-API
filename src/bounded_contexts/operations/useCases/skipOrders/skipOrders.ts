import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { SkipOrdersDto } from "./skipOrdersDto";
import { OrderId } from "../../domain/order/OrderId";

export class SkipOrders {
    private _orderRepository: IOrderRepository;

    constructor(orderRepository: IOrderRepository) {
        this._orderRepository = orderRepository;
    }

    public async execute(dto: SkipOrdersDto): Promise<any> {
        const ordersIds: OrderId[] = dto.ordersIds.map((id: any) => new OrderId(id));
        const orders: Order[] = await this.orderRepository.findByIdList(ordersIds);

        for (let order of orders) {
            order.skip();
        }

        console.log(orders);

        await this.orderRepository.saveSkippedOrders(orders);
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
