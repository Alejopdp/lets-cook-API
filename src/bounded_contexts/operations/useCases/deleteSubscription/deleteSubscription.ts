import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { DeleteSubscriptionDto } from "./deleteSubscriptionDto";

export class DeleteSubscription {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        logRepository: ILogRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
    }

    public async execute(dto: DeleteSubscriptionDto): Promise<any> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(subscriptionId);
        const subscriptionOrders: Order[] = await this.orderRepository.findAllBySubscriptionId(subscriptionId);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(
            subscriptionOrders.map((order) => order.paymentOrderId!)
        );
        const orderMap: { [paymentOrderId: string]: Order } = {};

        for (let order of subscriptionOrders) {
            orderMap[order.paymentOrderId?.toString()!] = order;
        }

        for (let paymentOrder of paymentOrders) {
            if (!!!paymentOrder.isBilled()) paymentOrder.discountOrderAmount(orderMap[paymentOrder.id.value]);
        }

        await this.orderRepository.destroyManyBySubscriptionId(subscriptionId);
        await this.paymentOrderRepository.updateMany(paymentOrders);
        await this.subscriptionRepository.destroy(subscriptionId);
        this.logRepository.save(
            new Log(
                LogType.PLAN_DELETED,
                "Admin",
                "Admin",
                `Se eliminó la suscripción con el ${subscription.plan.name} y variante ${subscription.getPlanVariantLabel(Locale.es)}`,
                `Se eliminó la suscripción ${subscriptionId.toString()}`,
                new Date(),
                subscription.customer.id
            )
        );
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
