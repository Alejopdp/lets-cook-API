import { logger } from "../../../../../config";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { CouponId } from "../../domain/cupons/CouponId";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { Plan } from "../../domain/plan/Plan";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionActive } from "../../domain/subscription/subscriptionState/SubscriptionActive";
import { Week } from "../../domain/week/Week";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { CreateSubscriptionDto } from "./createSubscriptionDto";

// [X] TO DO Create orders
// TO DO Assign orders to orderGroups???
// [X] TO DO Save customer, subscriptions, order and orderGroups
// TO DO Pay Stripe
// TO DO Notify customer
// TO DO Email templates
// TO DO Notify admin
// TO DO Entity SubscriptionCoupon

export class CreateSubscription {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _paymentService: IPaymentService;
    private _notificationService: INotificationService;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        shippingZoneRepository: IShippingZoneRepository,
        planRepository: IPlanRepository,
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        paymentService: IPaymentService,
        notificationService: INotificationService
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._planRepository = planRepository;
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._notificationService = notificationService;
        this._paymentService = paymentService;
    }

    public async execute(dto: CreateSubscriptionDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const couponId: CouponId | undefined = !!dto.couponId ? new CouponId(dto.couponId) : undefined;
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        if (!!!customer) throw new Error("No puedes pedir un nuevo plan");

        const planFrequency: PlanFrequency = (<any>PlanFrequency)[dto.planFrequency];
        const plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.planId), Locale.es);
        if (!!!plan) throw new Error("El plan ingresado no existe");

        const planVariantId: PlanVariantId = new PlanVariantId(dto.planVariantId);
        const planVariant: PlanVariant | undefined = plan.getPlanVariantById(new PlanVariantId(dto.planVariantId));
        if (!!!planVariant) throw new Error("La variante ingresada no existe");

        const subscription: Subscription = new Subscription(
            planVariantId,
            plan,
            planFrequency,
            new SubscriptionActive(),
            [],
            dto.restrictionComment,
            new Date(),
            0,
            customer,
            couponId,
            undefined,
            new Date(), // TO DO: Calculate
            undefined,
            undefined
        );

        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const customerShippingZone: ShippingZone | undefined = shippingZones.find((zone) => zone.hasAddressInside());
        if (!!!customerShippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        const nextTwelveWeeks: Week[] = await this.weekRepository.findNextTwelve(false); // Skip if it is not Sunday?
        const orders: Order[] = subscription.createNewOrders(customerShippingZone, nextTwelveWeeks);

        // if (!!!customer.hasAtLeastOnePaymentMethod() || !customer.hasPaymentMethodByStripeId(dto.stripePaymentMethodId)) {
        //     const newPaymentMethod = await this.paymentService.addPaymentMethodToCustomer(dto.stripePaymentMethodId, customer.stripeId);

        //     customer.addPaymentMethod(newPaymentMethod);
        // }

        // await this.paymentService.paymentIntent(
        //     plan.getPlanVariantPrice(planVariantId),
        //     customer.getDefaultPaymentMethod()?.stripeId!,
        //     customer.email,
        //     customer.stripeId
        // );
        await this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated();
        await this.notificationService.notifyCustomerAboutNewSubscriptionSuccessfullyCreated();
        await this.subscriptionRepository.save(subscription);
        await this.orderRepository.bulkSave(orders);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
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
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
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
}
