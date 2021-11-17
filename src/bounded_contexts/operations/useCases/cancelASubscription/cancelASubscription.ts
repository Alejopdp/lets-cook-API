import { INotificationService } from "@src/shared/notificationService/INotificationService";
import { IMailingListService } from "../../application/mailingListService/IMailingListService";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { CancelASubscriptionDto } from "./cancelASubscriptionDto";

export class CancelASubscription {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _notificationService: INotificationService;
    private _mailingListService: IMailingListService;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        notificationService: INotificationService,
        mailingListService: IMailingListService
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._notificationService = notificationService;
        this._mailingListService = mailingListService;
    }

    public async execute(dto: CancelASubscriptionDto): Promise<void> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const cancellationReason: CancellationReason = new CancellationReason(dto.cancellationReason, dto.cancellationComment, new Date());
        const subscription: Subscription | undefined = await this.subscriptionRepository.findByIdOrThrow(subscriptionId);
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(subscription.customer.id);

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));

        subscription.cancel(cancellationReason, orders, paymentOrders);
        if (customerSubscriptions.every((sub) => sub.state.isCancelled() || sub.id.equals(subscriptionId))) {
            this.mailingListService.updateSubscriber(subscription.customer.email, { shopify_tags: "Inactive subscriber" });
        }

        await this.orderRepository.saveCancelledOrders(orders.filter((order) => order.isCancelled())); // TO DO: Transaction / Queue
        await this.subscriptionRepository.save(subscription); // TO DO: Transaction / Queue
        await this.paymentOrderRepository.updateMany(paymentOrders); // TO DO: Transaction / Queue
        this.notificationService.notifyAdminAboutACancellation(subscription, dto.nameOrEmailOfAdminExecutingRequest);
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
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter mailingListService
     * @return {IMailingListService}
     */
    public get mailingListService(): IMailingListService {
        return this._mailingListService;
    }
}
