import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { GetNextOrdersBySubscriptionDto } from "./getNextOrdersBySubscriptionDto";
import { GetNextOrdersBySubscriptionPresenter } from "./getNextOrdersBySubscriptionPresenter";

export class GetNextOrdersBySubscription {
    private _orderRepository: IOrderRepository;

    constructor(orderRepository: IOrderRepository) {
        this._orderRepository = orderRepository;
    }

    public async execute(dto: GetNextOrdersBySubscriptionDto): Promise<any> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, dto.locale);

        return GetNextOrdersBySubscriptionPresenter.present(orders);
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
