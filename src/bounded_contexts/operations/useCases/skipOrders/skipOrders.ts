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
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { UpdateDiscountAfterSkippingOrders } from "../../services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders";

export class SkipOrders {
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;
    private _recipeRatingRepository: IRateRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _updateDiscountsAfterSkippingOrders: UpdateDiscountAfterSkippingOrders;

    constructor(
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        logRepository: ILogRepository,
        recipeRatingRepository: IRateRepository,
        subscriptionRepository: ISubscriptionRepository,
        updateDiscountsAfterSKippingOrders: UpdateDiscountAfterSkippingOrders
    ) {
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
        this._recipeRatingRepository = recipeRatingRepository;
        this._subscriptionRepository = subscriptionRepository
        this._updateDiscountsAfterSkippingOrders = updateDiscountsAfterSKippingOrders
    }

    public async execute(dto: SkipOrdersDto): Promise<any> {
        var ordersSkippedLogString: string = "";
        var ordersSkippedDebugLogString: string = "";
        var ordersUnskippedLogString: string = "";
        var ordersUnskippedDebugLogString: string = "";
        const ordersIds: OrderId[] = [...dto.ordersToReactivate, ...dto.ordersToSkip].map((id: any) => new OrderId(id));
        const incomingOrders: Order[] = await this.orderRepository.findByIdList(ordersIds, Locale.es);
        const [subscription, paymentOrders]: [Subscription, PaymentOrder[]] = await Promise.all([this.subscriptionRepository.findByIdOrThrow(incomingOrders[0].subscriptionId, Locale.es), this.paymentOrderRepository.findByIdList(
            incomingOrders.map((order) => order.paymentOrderId!)
        )])
        const orders: Order[] = await this.orderRepository.findByPaymentOrderIdList(
            paymentOrders.map((po) => po.id),
            Locale.es
        );

        const customerRatings: RecipeRating[] = await this.recipeRatingRepository.findAllByCustomer(orders[0].customer.id, Locale.es)
        const ordersMap: { [orderId: string]: Order } = {};
        const paymentOrdersMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const skippedOrdersToSave: Order[] = [];
        const activeOrdersToSave: Order[] = [];
        const ratingMap: { [recipeId: string]: RecipeRating } = {};


        for (let rating of customerRatings) {
            ratingMap[rating.recipe.id.toString()] = rating;
        }

        for (let order of orders) {
            ordersMap[order.id.toString()] = order;
        }

        for (let paymentOrder of paymentOrders) {
            paymentOrdersMap[paymentOrder.id.value] = paymentOrder;
        }

        for (let orderId of dto.ordersToSkip) {
            const order = ordersMap[orderId];
            const relatedPaymentOrder = paymentOrdersMap[order.paymentOrderId?.value!]

            if (!order.isSkipped() && !order.isBilled()) {
                ordersSkippedLogString = `${ordersSkippedLogString}, ${order.getWeekLabel(dto.locale)}`;
                ordersSkippedDebugLogString = `${ordersSkippedLogString} | ${order.id.toString()}`;
            }

            subscription?.skipOrder(order, relatedPaymentOrder, dto.queryDate)
            skippedOrdersToSave.push(order);

            for (let selection of order.recipeSelection) {
                var recipeRating = ratingMap[selection.recipe.id.toString()];

                recipeRating.removeOneDelivery(order.shippingDate);
            }

        }

        for (let orderId of dto.ordersToReactivate) {
            const order = ordersMap[orderId];
            if (!order.isActive() && !order.isBilled()) {
                ordersUnskippedLogString = `${ordersUnskippedLogString}, ${order.getWeekLabel(dto.locale)}`;
                ordersUnskippedDebugLogString = `${ordersUnskippedDebugLogString} | ${order.id.toString()}`;
            }
            for (let selection of order.recipeSelection) {
                var recipeRating = ratingMap[selection.recipe.id.toString()];

                recipeRating.addOneDelivery(order.shippingDate);
            }

            order.reactivate(paymentOrdersMap[order.paymentOrderId?.value!], dto.queryDate);
            activeOrdersToSave.push(order);
        }

        for (let paymentOrder of paymentOrders) {
            const principalPlanOrders = orders.filter((o) => o.paymentOrderId?.equals(paymentOrder.id) && o.plan.isPrincipal());

            if (principalPlanOrders.every((o) => o.isSkipped() || o.isCancelled())) {
                for (let order of orders) {
                    if (order.isActive() && order.paymentOrderId?.equals(paymentOrder.id) && !order.plan.isPrincipal()) {
                        order.skip(paymentOrder, dto.queryDate);
                        skippedOrdersToSave.push(order);
                    }
                }
            }
        }

        await this.orderRepository.updateMany([...skippedOrdersToSave, ...activeOrdersToSave]);
        await this.paymentOrderRepository.updateMany(paymentOrders);
        await this.subscriptionRepository.save(subscription)

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

        await this.updateDiscountsAfterSkippingOrders.execute({ subscriptionId: incomingOrders[0].subscriptionId.toString(), queryDate: dto.queryDate })
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


    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }


    /**
     * Getter updateDiscountsAfterSkippingOrders
     * @return {UpdateDiscountAfterSkippingOrders}
     */
    public get updateDiscountsAfterSkippingOrders(): UpdateDiscountAfterSkippingOrders {
        return this._updateDiscountsAfterSkippingOrders;
    }

}
