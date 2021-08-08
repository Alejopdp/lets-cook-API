import Stripe from "stripe";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { CouponId } from "../../domain/cupons/CouponId";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { PaymentMethodId } from "../../domain/customer/paymentMethod/PaymentMethodId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Plan } from "../../domain/plan/Plan";
import { IPlanFrequency } from "../../domain/plan/PlanFrequency/IPlanFrequency";
import { PlanFrequencyFactory } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
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
import { CreateSubscriptionDto } from "./createSubscriptionDto";

export class CreateSubscription {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _paymentService: IPaymentService;
    private _notificationService: INotificationService;
    private _assignOrdersToPaymentOrderService: AssignOrdersToPaymentOrders;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _updatePaymentOrdersShippingCostByCustomer: UpdatePaymentOrdersShippingCostByCustomer;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        shippingZoneRepository: IShippingZoneRepository,
        planRepository: IPlanRepository,
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        paymentService: IPaymentService,
        notificationService: INotificationService,
        assignOrdersToPaymentOrderService: AssignOrdersToPaymentOrders,
        paymentOrderRepository: IPaymentOrderRepository,
        updatePaymentOrdersShippingCostByCustomer: UpdatePaymentOrdersShippingCostByCustomer
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._planRepository = planRepository;
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._notificationService = notificationService;
        this._paymentService = paymentService;
        this._assignOrdersToPaymentOrderService = assignOrdersToPaymentOrderService;
        this._paymentOrderRepository = paymentOrderRepository;
        this._updatePaymentOrdersShippingCostByCustomer = updatePaymentOrdersShippingCostByCustomer;
    }

    public async execute(dto: CreateSubscriptionDto): Promise<{
        subscription: Subscription;
        paymentIntent: Stripe.PaymentIntent;
        firstOrder: Order;
        customerPaymentMethods: PaymentMethod[];
    }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const couponId: CouponId | undefined = !!dto.couponId ? new CouponId(dto.couponId) : undefined;
        const customer: Customer | undefined = await this.customerRepository.findByIdOrThrow(customerId);
        const planFrequency: IPlanFrequency = PlanFrequencyFactory.createPlanFrequency(dto.planFrequency);
        const plan: Plan | undefined = await this.planRepository.findByIdOrThrow(new PlanId(dto.planId), Locale.es);
        const planVariantId: PlanVariantId = new PlanVariantId(dto.planVariantId);
        const planVariant: PlanVariant | undefined = plan.getPlanVariantById(new PlanVariantId(dto.planVariantId));
        const addressIsChanged: boolean =
            !!dto.latitude && !!dto.longitude && customer.hasDifferentLatAndLngAddress(dto.latitude, dto.longitude);
        const oneActivePaymentOrder: PaymentOrder | undefined = await this.paymentOrderRepository.findAnActivePaymentOrder();
        if (!!!planVariant) throw new Error("La variante ingresada no existe");

        customer.changePersonalInfo(dto.customerFirstName, dto.customerLastName, dto.phone1, "", "", dto.locale);
        if (addressIsChanged) {
            customer.changeShippingAddress(
                dto.latitude,
                dto.longitude,
                dto.addressName,
                dto.addressName,
                dto.addressDetails,
                customer.shippingAddress?.deliveryTime
            );
            customer.changeBillingAddress(
                dto.latitude,
                dto.longitude,
                dto.addressName,
                customer.billingAddress?.customerName || `${dto.customerFirstName} ${dto.customerLastName}`,
                dto.addressDetails,
                customer.billingAddress?.identification || ""
            );
        }

        const subscription: Subscription = new Subscription(
            planVariantId,
            plan,
            planFrequency,
            new SubscriptionActive(),
            dto.restrictionComment,
            new Date(),
            customer,
            plan.getPlanVariantPrice(planVariantId),
            undefined,
            couponId,
            undefined, // Validate and use cupón
            undefined,
            new Date() // TO DO: Calculate
        );

        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const customerShippingZone: ShippingZone | undefined = shippingZones.find((zone) =>
            zone.hasAddressInside(customer.shippingAddress?.latitude!, customer.shippingAddress?.longitude!)
        );
        if (!!!customerShippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        const nextTwelveWeeks: Week[] = await this.weekRepository.findNextTwelveByFrequency(subscription.frequency); // Skip if it is not Sunday?
        const orders: Order[] = subscription.createNewOrders(customerShippingZone, nextTwelveWeeks);

        const assignOrdersToPaymentOrdersDto: AssignOrdersToPaymentOrdersDto = {
            customerId: customer.id,
            orders,
            subscription,
            weeks: nextTwelveWeeks,
            shippingCost: customerShippingZone.cost,
        };

        const { newPaymentOrders, paymentOrdersToUpdate } = await this.assignOrdersToPaymentOrders.execute(assignOrdersToPaymentOrdersDto);

        if (dto.stripePaymentMethodId) {
            const newPaymentMethod = await this.paymentService.addPaymentMethodToCustomer(dto.stripePaymentMethodId, customer.stripeId);

            customer.addPaymentMethod(newPaymentMethod);
        }

        const paymentIntent = await this.paymentService.paymentIntent(
            plan.getPlanVariantPrice(planVariantId),
            dto.stripePaymentMethodId
                ? dto.stripePaymentMethodId
                : customer.getPaymentMethodStripeId(new PaymentMethodId(dto.paymentMethodId)),
            customer.email,
            customer.stripeId
        );

        newPaymentOrders[0]?.toBilled(orders.filter((order) => order.paymentOrderId?.equals(newPaymentOrders[0].id))); // TO DO: Handlear 3dSecure rechazado

        await this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated();
        await this.notificationService.notifyCustomerAboutNewSubscriptionSuccessfullyCreated();
        await this.subscriptionRepository.save(subscription);
        await this.orderRepository.bulkSave(orders);
        await this.customerRepository.save(customer);
        if (newPaymentOrders.length > 0) await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        if (addressIsChanged && oneActivePaymentOrder && oneActivePaymentOrder.shippingCost !== customerShippingZone.cost) {
            for (let paymentOrder of paymentOrdersToUpdate) {
                paymentOrder.shippingCost = customerShippingZone.cost;
            }
        }
        if (paymentOrdersToUpdate.length > 0) await this.paymentOrderRepository.updateMany(paymentOrdersToUpdate);

        return { subscription, paymentIntent, firstOrder: orders[0], customerPaymentMethods: customer.paymentMethods };
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
     * Getter updatePaymentOrdersShippingCostByCustomer
     * @return {UpdatePaymentOrdersShippingCostByCustomer}
     */
    public get updatePaymentOrdersShippingCostByCustomer(): UpdatePaymentOrdersShippingCostByCustomer {
        return this._updatePaymentOrdersShippingCostByCustomer;
    }
}
