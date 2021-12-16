import { INotificationService } from "@src/shared/notificationService/INotificationService";
import { IMailingListService } from "../../application/mailingListService/IMailingListService";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { CancelASubscriptionDto } from "./cancelASubscriptionDto";

export class CancelASubscription {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _notificationService: INotificationService;
    private _mailingListService: IMailingListService;
    private _logRepository: ILogRepository;
    private _recipeRatingRepository: IRateRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        notificationService: INotificationService,
        mailingListService: IMailingListService,
        logRepository: ILogRepository,
        recipeRatingRepository: IRateRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._notificationService = notificationService;
        this._mailingListService = mailingListService;
        this._logRepository = logRepository;
        this._recipeRatingRepository = recipeRatingRepository;
    }

    public async execute(dto: CancelASubscriptionDto): Promise<void> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const cancellationReason: CancellationReason = new CancellationReason(dto.cancellationReason, dto.cancellationComment, new Date());
        const subscription: Subscription | undefined = await this.subscriptionRepository.findByIdOrThrow(subscriptionId);
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(subscription.customer.id);
        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));
        const customerRatings: RecipeRating[] = await this.recipeRatingRepository.findAllByCustomer(subscription?.customer.id!, Locale.es);
        const recipeRatingsMap: { [recipeId: string]: RecipeRating } = {};

        for (let rating of customerRatings) {
            recipeRatingsMap[rating.recipe.id.toString()] = rating;
        }

        for (let order of orders) {
            for (let selection of order.recipeSelection) {
                var rating = recipeRatingsMap[selection.recipe.id.toString()];

                rating?.removeOneDelivery(order.shippingDate);
            }
        }

        subscription.cancel(cancellationReason, orders, paymentOrders);
        if (customerSubscriptions.every((sub) => sub.state.isCancelled() || sub.id.equals(subscriptionId))) {
            this.mailingListService.updateSubscriber(subscription.customer.email, { shopify_tags: "Inactive subscriber" });
        }

        await this.orderRepository.saveCancelledOrders(orders.filter((order) => order.isCancelled())); // TO DO: Transaction / Queue
        await this.subscriptionRepository.save(subscription); // TO DO: Transaction / Queue
        await this.paymentOrderRepository.updateMany(paymentOrders); // TO DO: Transaction / Queue
        this.notificationService.notifyAdminAboutACancellation(subscription, dto.nameOrEmailOfAdminExecutingRequest);
        this.recipeRatingRepository.updateMany(customerRatings);

        const log: Log = new Log(
            LogType.SUBSCRIPTION_CANCELLED,
            dto.nameOrEmailOfAdminExecutingRequest || subscription.customer.getFullNameOrEmail(),
            !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
            `Suscripción de ${subscription.plan.name} y variante ${subscription.getPlanVariantLabel(Locale.es)} cancelada`,
            `Suscripción ${subscription.id.toString()} cancelada`,
            new Date(),
            subscription.customer.id
        );
        this.logRepository.save(log);
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
