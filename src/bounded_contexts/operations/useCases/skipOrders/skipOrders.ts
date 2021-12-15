import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { SkipOrdersDto } from "./skipOrdersDto";
import { OrderId } from "../../domain/order/OrderId";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Locale } from "../../domain/locale/Locale";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";

export class SkipOrders {
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;

    constructor(orderRepository: IOrderRepository, paymentOrderRepository: IPaymentOrderRepository, logRepository: ILogRepository) {
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
    }

    public async execute(dto: SkipOrdersDto): Promise<any> {
        const ordersIds: OrderId[] = [...dto.ordersToReactivate, ...dto.ordersToSkip].map((id: any) => new OrderId(id));
        const orders: Order[] = await this.orderRepository.findByIdList(ordersIds, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));
        const ordersMap: { [orderId: string]: Order } = {};
        const paymentOrdersMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const skippedOrdersToSave: Order[] = [];
        const activeOrdersToSave: Order[] = [];
        var ordersSkippedLogString: string = "";
        var ordersSkippedDebugLogString: string = "";
        var ordersUnskippedLogString: string = "";
        var ordersUnskippedDebugLogString: string = "";

        for (let order of orders) {
            ordersMap[order.id.value] = order;
        }

        for (let paymentOrder of paymentOrders) {
            paymentOrdersMap[paymentOrder.id.value] = paymentOrder;
        }

        for (let orderId of dto.ordersToSkip) {
            const order = ordersMap[orderId];
            if (!order.isSkipped() && !order.isBilled()) {
                ordersSkippedLogString = `${ordersSkippedLogString}, ${order.getWeekLabel()}`;
                ordersSkippedDebugLogString = `${ordersSkippedLogString} | ${order.id.toString()}`;
            }

            order.skip(paymentOrdersMap[order.paymentOrderId?.value!]);
            skippedOrdersToSave.push(order);
        }

        for (let orderId of dto.ordersToReactivate) {
            const order = ordersMap[orderId];
            if (!order.isActive() && !order.isBilled()) {
                ordersUnskippedLogString = `${ordersUnskippedLogString}, ${order.getWeekLabel()}`;
                ordersUnskippedDebugLogString = `${ordersUnskippedDebugLogString} | ${order.id.toString()}`;
            }

            order.reactivate(paymentOrdersMap[order.paymentOrderId?.value!]);
            activeOrdersToSave.push(order);
        }

        // await this.orderRepository.saveSkippedAndActiveOrders(skippedOrdersToSave, activeOrdersToSave);
        await this.orderRepository.updateMany([...skippedOrdersToSave, ...activeOrdersToSave]);
        await this.paymentOrderRepository.updateMany(paymentOrders);

        if (!!ordersSkippedLogString) {
            this.logRepository.save(
                new Log(
                    LogType.ITEM_SKIP_COMPLETED,
                    dto.nameOrEmailOfAdminExecutingRequest || orders[0].customer.getFullNameOrEmail(),
                    !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
                    `Se saltaron las semanas ${ordersSkippedLogString}`,
                    `Se saltaron las semanas ${ordersSkippedDebugLogString}`,
                    new Date(),
                    orders[0].customer.id
                )
            );
        }

        if (!!ordersUnskippedLogString) {
            this.logRepository.save(
                new Log(
                    LogType.ITEM_UNSKIPPED_COMPLETED,
                    dto.nameOrEmailOfAdminExecutingRequest || orders[0].customer.getFullNameOrEmail(),
                    !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
                    `Se reanudaron las semanas ${ordersUnskippedLogString}`,
                    `Se reanudaron las semanas ${ordersUnskippedDebugLogString}`,
                    new Date(),
                    orders[0].customer.id
                )
            );
        }
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

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}
