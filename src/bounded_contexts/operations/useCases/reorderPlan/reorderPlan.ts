import Stripe from "stripe";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { SubscriptionActive } from "../../domain/subscription/subscriptionState/SubscriptionActive";
import { Week } from "../../domain/week/Week";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { AssignOrdersToPaymentOrders } from "../../services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { AssignOrdersToPaymentOrdersDto } from "../../services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrdersDto";
import { UpdatePaymentOrdersShippingCostByCustomer } from "../../services/updatePaymentOrdersShippingCostByCustomer/updatePaymentOrdersShippingCostByCustomer";
import { ReorderPlanDto } from "./reorderPlanDto";

export class ReorderPlan {
    private _subscriptionRepository: ISubscriptionRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _paymentService: IPaymentService;
    private _notificationService: INotificationService;
    private _assignOrdersToPaymentOrderService: AssignOrdersToPaymentOrders;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _customerRepository: ICustomerRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        shippingZoneRepository: IShippingZoneRepository,
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        paymentService: IPaymentService,
        notificationService: INotificationService,
        assignOrdersToPaymentOrderService: AssignOrdersToPaymentOrders,
        paymentOrderRepository: IPaymentOrderRepository,
        customerRepository: ICustomerRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._notificationService = notificationService;
        this._paymentService = paymentService;
        this._assignOrdersToPaymentOrderService = assignOrdersToPaymentOrderService;
        this._paymentOrderRepository = paymentOrderRepository;
        this._customerRepository = customerRepository;
    }

    public async execute(
        dto: ReorderPlanDto
    ): Promise<{ subscription: Subscription; paymentIntent: Stripe.PaymentIntent; firstOrder: Order }> {
        const oldSubscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const oldSubscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(oldSubscriptionId);
        const subscription: Subscription = new Subscription(
            oldSubscription.planVariantId,
            oldSubscription.plan,
            oldSubscription.frequency,
            new SubscriptionActive(),
            oldSubscription.restrictionComment,
            new Date(),
            oldSubscription.customer,
            oldSubscription.plan.getPlanVariantPrice(oldSubscription.planVariantId),
            oldSubscription.restriction,
            undefined,
            undefined, // Validate and use cupón
            undefined,
            new Date() // TO DO: Calculate,
        );
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findActiveSusbcriptionsByCustomerId(
            oldSubscription.customer.id
        );

        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const customerShippingZone: ShippingZone | undefined = shippingZones.find((zone) =>
            zone.hasAddressInside(subscription.customer.shippingAddress?.latitude!, subscription.customer.shippingAddress?.longitude!)
        );
        if (!!!customerShippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        const nextTwelveWeeks: Week[] = await this.weekRepository.findNextTwelveByFrequency(subscription.frequency); // Skip if it is not Sunday?
        const orders: Order[] = subscription.createNewOrders(customerShippingZone, nextTwelveWeeks);

        const assignOrdersToPaymentOrdersDto: AssignOrdersToPaymentOrdersDto = {
            customerId: subscription.customer.id,
            orders,
            subscription,
            weeks: nextTwelveWeeks,
            shippingCost: customerShippingZone.cost,
            hasFreeShipping: customerSubscriptions.length > 0,
        };

        const { newPaymentOrders, paymentOrdersToUpdate } = await this.assignOrdersToPaymentOrders.execute(assignOrdersToPaymentOrdersDto);

        const hasFreeShipping =
            customerSubscriptions.some((sub) => sub.coupon?.type.type === "free") || // !== free because in subscription.getPriceWithDiscount it's taken into account
            customerSubscriptions.length > 0;

        const paymentIntent = await this.paymentService.paymentIntent(
            hasFreeShipping
                ? subscription.plan.getPlanVariantPrice(subscription.planVariantId) - customerShippingZone.cost
                : subscription.plan.getPlanVariantPrice(subscription.planVariantId),
            subscription.customer.getDefaultPaymentMethod()?.stripeId || "",
            subscription.customer.email,
            subscription.customer.stripeId
        );

        newPaymentOrders[0].paymentIntentId = paymentIntent.id;
        newPaymentOrders[0].shippingCost = hasFreeShipping ? 0 : customerShippingZone.cost;

        if (paymentIntent.status === "requires_action") {
            newPaymentOrders[0].toPendingConfirmation(orders);
        } else if (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "canceled") {
            throw new Error("El pago ha fallado, por favor intente de nuevo o pruebe con una nueva tarjeta");
        } else {
            newPaymentOrders[0]?.toBilled(orders);
        }

        // await this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated();
        // @ts-ignore
        // await this.notificationService.notifyCustomerAboutNewSubscriptionSuccessfullyCreated({});
        await this.subscriptionRepository.save(subscription);
        await this.orderRepository.bulkSave(orders);
        await this.customerRepository.save(subscription.customer);
        if (newPaymentOrders.length > 0) await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        if (paymentOrdersToUpdate.length > 0) await this.paymentOrderRepository.updateMany(paymentOrdersToUpdate);

        return { subscription, paymentIntent, firstOrder: orders[0] };
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter assignOrdersToPaymentOrder
     * @return {AssignOrdersToPaymentOrders}
     */
    public get assignOrdersToPaymentOrders(): AssignOrdersToPaymentOrders {
        return this._assignOrdersToPaymentOrderService;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
