import {
    INotificationService,
    NewSubscriptionNotificationDto,
    PaymentOrderBilledNotificationDto,
} from "@src/shared/notificationService/INotificationService";
import Stripe from "stripe";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { PaymentMethodId } from "../../domain/customer/paymentMethod/PaymentMethodId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
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
import { createFriendCode } from "../../services/createFriendCode";
import { CreateSubscriptionAsAdminDto } from "./createSubscriptionAsAdminDto";

export class CreateSubscriptionAsAdmin {
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
        paymentOrderRepository: IPaymentOrderRepository
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
    }
    public async execute(dto: CreateSubscriptionAsAdminDto): Promise<any> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const [customerSubscriptionHistory, customer, plan, paymentOrdersWithHumanIdCount, shippingZones] = await Promise.all([
            this.subscriptionRepository.findByCustomerId(customerId),
            this.customerRepository.findByIdOrThrow(customerId),
            this.planRepository.findByIdOrThrow(new PlanId(dto.planId), Locale.es),
            this.paymentOrderRepository.countPaymentOrdersWithHumanId(),
            this.shippingZoneRepository.findAll(),
        ]);
        const customerDefaultPaymentMethod: PaymentMethod | undefined = customer.getDefaultPaymentMethod();
        if (!!!customerDefaultPaymentMethod) throw new Error("El cliente no tiene ningún método de pago ingresado");

        const customerSubscriptions: Subscription[] = customerSubscriptionHistory.filter((sub) => sub.isActive());
        const planFrequency: IPlanFrequency = PlanFrequencyFactory.createPlanFrequency(dto.planFrequency);
        const planVariantId: PlanVariantId = new PlanVariantId(dto.planVariantId);
        const planVariant: PlanVariant | undefined = plan.getPlanVariantById(new PlanVariantId(dto.planVariantId));
        if (!!!planVariant) throw new Error("La variante ingresada no existe");

        const subscription: Subscription = new Subscription(
            planVariantId,
            plan,
            planFrequency,
            new SubscriptionActive(),
            "",
            new Date(),
            customer,
            plan.getPlanVariantPrice(planVariantId),
            undefined,
            undefined,
            undefined,
            undefined,
            new Date() // TO DO: Calculate
        );

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
            hasFreeShipping: customerSubscriptions.length > 0,
        };

        const { newPaymentOrders, paymentOrdersToUpdate } = await this.assignOrdersToPaymentOrderService.execute(
            assignOrdersToPaymentOrdersDto
        );

        const hasFreeShipping =
            // TO DO: Validar que la semana proxima tiene al menos 1 envio
            // paymentOrdersToUpdate.some(po => po.)
            customerSubscriptions.some((sub) => sub.coupon?.type.type === "free") || // !== free because in subscription.getPriceWithDiscount it's taken into account
            customerSubscriptions.length > 0;

        var paymentIntent: Stripe.PaymentIntent = {
            id: "",
            status: "succeeded",
            client_secret: "",
            object: "payment_intent",
            amount: 0,
            amount_capturable: 0,
            amount_received: 0,
            application: null,
            application_fee_amount: null,
            canceled_at: null,
            cancellation_reason: null,
            capture_method: "automatic",
            confirmation_method: "automatic",
            created: 0,
            currency: "",
            customer: null,
            description: null,
            invoice: null,
            last_payment_error: null,
            livemode: false,
            next_action: null,
            on_behalf_of: null,
            payment_method: null,
            payment_method_options: null,
            payment_method_types: [],
            receipt_email: null,
            review: null,
            setup_future_usage: null,
            shipping: null,
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            transfer_data: null,
            transfer_group: null,
            //@ts-ignore
            charges: undefined,
            metadata: {},
        };

        const amountToBill = hasFreeShipping
            ? (Math.round(newPaymentOrders[0].getTotalAmount() * 100) - Math.round(customerShippingZone.cost * 100)) / 100
            : newPaymentOrders[0].getTotalAmount();

        if (Math.round(newPaymentOrders[0].getFinalAmount()) >= 0.5) {
            paymentIntent = await this.paymentService.paymentIntent(
                amountToBill,
                customerDefaultPaymentMethod.stripeId,
                customer.email,
                customer.stripeId,
                true
            );
        }

        newPaymentOrders[0].paymentIntentId = paymentIntent.id;
        newPaymentOrders[0].shippingCost = hasFreeShipping ? 0 : customerShippingZone.cost;

        if (!!paymentIntent && paymentIntent.status === "requires_action") {
            throw new Error("El método de pago del cliente requiere una confirmación por parte de el");
        } else if (!!paymentIntent && (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "canceled")) {
            throw new Error("El pago ha fallado, por favor intente de nuevo o pruebe con una nueva tarjeta");
        } else {
            newPaymentOrders[0]?.toBilled(orders, customer);
            newPaymentOrders[0] ? newPaymentOrders[0].addHumanId(paymentOrdersWithHumanIdCount) : "";
            if (customerSubscriptionHistory.length === 0) createFriendCode.execute({ customer });
        }

        const notificationDto: NewSubscriptionNotificationDto = {
            customerEmail: customer.email,
            customerFirstName: customer.email,
            customerLastName: customer.getPersonalInfo().lastName!,
            firstOrderId: orders[0].id.value as string,
            hasIndicatedRestrictions: subscription.restrictionComment,
            isPlanAhorro: false,
            planName: subscription.plan.name,
            recipeSelection: [],
            shippingCost: hasFreeShipping ? 0 : customerShippingZone.cost,
            shippingDay: orders[0].getHumanShippmentDay(dto.locale),
            planSku: subscription.plan.planSku.code,
        };
        await this.subscriptionRepository.save(subscription);
        await this.orderRepository.bulkSave(orders);
        await this.customerRepository.save(customer);
        if (newPaymentOrders.length > 0) await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        if (paymentOrdersToUpdate.length > 0) await this.paymentOrderRepository.updateMany(paymentOrdersToUpdate);

        this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated(notificationDto);

        const ticketDto: PaymentOrderBilledNotificationDto = {
            customerEmail: customer.email,
            foodVAT: Math.round((amountToBill * 0.1 + Number.EPSILON) * 100) / 100,
            orders: [orders[0]],
            paymentOrderHumanNumber: (newPaymentOrders[0].getHumanIdOrIdValue() as string) || "",
            phoneNumber: customer.personalInfo?.phone1 || "",
            shippingAddressCity: "",
            shippingAddressName: customer.getShippingAddress().name || "",
            shippingCost: newPaymentOrders[0].shippingCost,
            shippingCustomerName: customer.getPersonalInfo().fullName || "",
            shippingDate: orders[0].getHumanShippmentDay(dto.locale),
            totalAmount: amountToBill,
            discountAmount: newPaymentOrders[0].getDiscountAmountOrShippingCostIfHasFreeShipping(),
        };
        this.notificationService.notifyCustomerAboutPaymentOrderBilled(ticketDto);

        return {
            subscription,
            paymentIntent,
            // firstOrder: today.getDay() === 0 ? orders[1] : orders[0],
            firstOrder: orders[0],
            billedPaymentOrderHumanId: newPaymentOrders[0].getHumanIdOrIdValue(),
            customerPaymentMethods: customer.paymentMethods,
            amountBilled: amountToBill,
            tax:
                Math.round((amountToBill - newPaymentOrders[0].shippingCost) * 0.1) +
                (hasFreeShipping ? 0 : Math.round(newPaymentOrders[0].shippingCost * 0.21)),
            shippingCost: hasFreeShipping ? 0 : newPaymentOrders[0].shippingCost,
        };
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
     * Getter assignOrdersToPaymentOrderService
     * @return {AssignOrdersToPaymentOrders}
     */
    public get assignOrdersToPaymentOrderService(): AssignOrdersToPaymentOrders {
        return this._assignOrdersToPaymentOrderService;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
