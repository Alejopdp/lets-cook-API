import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { SkipOrdersDto } from "./skipOrdersDto";
import { OrderId } from "../../domain/order/OrderId";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class SkipOrders {
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(orderRepository: IOrderRepository, paymentOrderRepository: IPaymentOrderRepository) {
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(dto: SkipOrdersDto): Promise<any> {
        console.log("Orders to skip: ", dto.ordersToSkip);
        const ordersIds: OrderId[] = [...dto.ordersToReactivate, ...dto.ordersToSkip].map((id: any) => new OrderId(id));
        const orders: Order[] = await this.orderRepository.findByIdList(ordersIds);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));
        const ordersMap: { [orderId: string]: Order } = {};
        const paymentOrdersMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const skippedOrdersToSave: Order[] = [];
        const activeOrdersToSave: Order[] = [];

        for (let order of orders) {
            ordersMap[order.id.value] = order;
        }

        for (let paymentOrder of paymentOrders) {
            paymentOrdersMap[paymentOrder.id.value] = paymentOrder;
        }

        for (let orderId of dto.ordersToSkip) {
            const order = ordersMap[orderId];
            order.skip(paymentOrdersMap[order.paymentOrderId?.value!]);
            skippedOrdersToSave.push(order);
        }

        for (let orderId of dto.ordersToReactivate) {
            const order = ordersMap[orderId];
            order.reactivate(paymentOrdersMap[order.paymentOrderId?.value!]);
            activeOrdersToSave.push(order);
        }

        // await this.orderRepository.saveSkippedAndActiveOrders(skippedOrdersToSave, activeOrdersToSave);
        await this.orderRepository.updateMany([...skippedOrdersToSave, ...activeOrdersToSave]);
        await this.paymentOrderRepository.updateMany(paymentOrders);
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
