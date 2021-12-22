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
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";

export class SkipOrders {
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;
    private _recipeRatingRepository: IRateRepository;

    constructor(
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        logRepository: ILogRepository,
        recipeRatingRepository: IRateRepository
    ) {
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
        this._recipeRatingRepository = recipeRatingRepository;
    }

    public async execute(dto: SkipOrdersDto): Promise<any> {
        const ordersIds: OrderId[] = [...dto.ordersToReactivate, ...dto.ordersToSkip].map((id: any) => new OrderId(id));
        const incomingOrders: Order[] = await this.orderRepository.findByIdList(ordersIds, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(
            incomingOrders.map((order) => order.paymentOrderId!)
        );
        const orders: Order[] = await this.orderRepository.findByPaymentOrderIdList(
            paymentOrders.map((po) => po.id),
            Locale.es
        );
        const customerRatings: RecipeRating[] = await this.recipeRatingRepository.findAllByCustomer(orders[0].customer.id, Locale.es);
        const ordersMap: { [orderId: string]: Order } = {};
        const paymentOrdersMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const skippedOrdersToSave: Order[] = [];
        const activeOrdersToSave: Order[] = [];
        const ratingMap: { [ratingId: string]: RecipeRating } = {};
        var ordersSkippedLogString: string = "";
        var ordersSkippedDebugLogString: string = "";
        var ordersUnskippedLogString: string = "";
        var ordersUnskippedDebugLogString: string = "";

        for (let rating of customerRatings) {
            ratingMap[rating.recipe.id.value] = rating;
        }

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

            for (let selection of order.recipeSelection) {
                var recipeRating = ratingMap[selection.recipe.id.toString()];

                recipeRating.removeOneDelivery(order.shippingDate);
            }
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

        for (let paymentOrder of paymentOrders) {
            const principalPlanOrders = orders.filter((o) => o.paymentOrderId?.equals(paymentOrder.id) && o.plan.isPrincipal());

            if (principalPlanOrders.every((o) => o.isSkipped() || o.isCancelled())) {
                console.log("TOdas skipped");

                for (let order of orders) {
                    console.log(`${order.isActive()} ${order.paymentOrderId?.equals(paymentOrder.id)} ${!order.plan.isPrincipal()}`);
                    if (order.isActive() && order.paymentOrderId?.equals(paymentOrder.id) && !order.plan.isPrincipal()) {
                        order.skip(paymentOrder);
                        skippedOrdersToSave.push(order);
                    }
                }
            }
        }

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

        this.recipeRatingRepository.updateMany(customerRatings);
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

    /**
     * Getter recipeRatingRepository
     * @return {IRateRepository}
     */
    public get recipeRatingRepository(): IRateRepository {
        return this._recipeRatingRepository;
    }
}
