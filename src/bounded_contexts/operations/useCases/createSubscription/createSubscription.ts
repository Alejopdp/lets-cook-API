import {
    INotificationService,
    NewSubscriptionNotificationDto,
    PaymentOrderBilledNotificationDto,
} from "../../../../shared/notificationService/INotificationService";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { CouponId } from "../../domain/cupons/CouponId";
import { Coupon } from "../../domain/cupons/Cupon";
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
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { AssignOrdersToPaymentOrders } from "../../services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { AssignOrdersToPaymentOrdersDto } from "../../services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrdersDto";
import { CreateSubscriptionDto } from "./createSubscriptionDto";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { PaymentIntent } from "../../application/paymentService";
import { CreateFriendCode } from "../../services/createFriendCode/createFriendCode";
import { Customer } from "../../domain/customer/Customer";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class CreateSubscription {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _couponRepository: ICouponRepository;
    private _paymentService: IPaymentService;
    private _notificationService: INotificationService;
    private _assignOrdersToPaymentOrderService: AssignOrdersToPaymentOrders;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;
    private _createFriendCodeService: CreateFriendCode;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        shippingZoneRepository: IShippingZoneRepository,
        planRepository: IPlanRepository,
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        couponRepository: ICouponRepository,
        paymentService: IPaymentService,
        notificationService: INotificationService,
        assignOrdersToPaymentOrderService: AssignOrdersToPaymentOrders,
        paymentOrderRepository: IPaymentOrderRepository,
        logRepository: ILogRepository,
        createFriendCodeService: CreateFriendCode
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._planRepository = planRepository;
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._couponRepository = couponRepository;
        this._notificationService = notificationService;
        this._paymentService = paymentService;
        this._assignOrdersToPaymentOrderService = assignOrdersToPaymentOrderService;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
        this._createFriendCodeService = createFriendCodeService;
    }

    public async execute(dto: CreateSubscriptionDto): Promise<{
        subscription: Subscription;
        paymentIntent: PaymentIntent;
        firstOrder: Order;
        customerPaymentMethods: PaymentMethod[];
        amountBilled: number;
        tax: number;
        shippingCost: number;
        billedPaymentOrderHumanId: string | number;
    }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const [customerSubscriptionHistory, customer, plan, paymentOrdersWithHumanIdCount, shippingZones] = await Promise.all([
            this.subscriptionRepository.findByCustomerId(customerId, Locale.es),
            this.customerRepository.findByIdOrThrow(customerId),
            this.planRepository.findByIdOrThrow(new PlanId(dto.planId), Locale.es),
            this.paymentOrderRepository.countPaymentOrdersWithHumanId(),
            this.shippingZoneRepository.findAllActive(),
        ]);
        const coupon: Coupon | undefined = !!dto.couponId ? await this.couponRepository.findById(new CouponId(dto.couponId)) : undefined;
        const customerSubscriptions: Subscription[] = customerSubscriptionHistory.filter((sub) => sub.isActive());
        const planFrequency: IPlanFrequency = PlanFrequencyFactory.createPlanFrequency(dto.planFrequency);
        const planVariantId: PlanVariantId = new PlanVariantId(dto.planVariantId);
        const planVariant: PlanVariant | undefined = plan.getPlanVariantById(new PlanVariantId(dto.planVariantId));
        if (!!!planVariant) throw new Error("La variante ingresada no existe");

        this.updateCustomerPersonalInformation(customer, dto)
        this.updateCustomerShippingAddress(customer, dto)

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
            coupon,
            undefined,
            undefined,
            new Date() // TO DO: Calculate
        );

        const customerShippingZone: ShippingZone = this.getCustomerShippingZone(customer, shippingZones)
        const nextTwelveWeeks: Week[] = await this.weekRepository.findNextTwelveByFrequency(subscription.frequency, subscription.getFirstOrderShippingDate(customerShippingZone.getDayNumberOfWeek())); // Skip if it is not Sunday?
        const orders: Order[] = subscription.createNewOrders(customerShippingZone, nextTwelveWeeks);

        const assignOrdersToPaymentOrdersDto: AssignOrdersToPaymentOrdersDto = {
            customerId: customer.id,
            orders,
            subscription,
            weeks: nextTwelveWeeks,
            shippingCost: customerShippingZone.cost,
            hasFreeShipping: customerSubscriptions.length > 0,
        };

        const { newPaymentOrders, paymentOrdersToUpdate } = await this.assignOrdersToPaymentOrders.execute(assignOrdersToPaymentOrdersDto);

        if (dto.stripePaymentMethodId) {
            const newPaymentMethod = await this.paymentService.addPaymentMethodToCustomer(dto.stripePaymentMethodId, customer.stripeId);

            customer.addPaymentMethodAndSetItAsDefault(newPaymentMethod);
        }

        const hasFreeShipping =
            // TO DO: Validar que la semana proxima tiene al menos 1 envio
            coupon?.type.type === "free" ||
            customerSubscriptions.some((sub) => sub.coupon?.type.type === "free") || // !== free because in subscription.getPriceWithDiscount it's taken into account
            customerSubscriptions.length > 0;

        var paymentIntent: PaymentIntent = {
            id: "",
            status: "succeeded",
            client_secret: "",
        };

        const billedAmount = await this.charge(customer, newPaymentOrders, hasFreeShipping, customerShippingZone.cost, customerSubscriptionHistory.length, orders, dto.paymentMethodId, paymentOrdersWithHumanIdCount, dto.stripePaymentMethodId)

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
        if (orders[0].isBilled() && dto.couponId) orders[0].couponCode = coupon?.couponCode ?? ""
        await this.subscriptionRepository.save(subscription);
        await this.orderRepository.insertMany(orders);
        await this.customerRepository.save(customer);
        if (newPaymentOrders.length > 0) await this.paymentOrderRepository.bulkSave(newPaymentOrders);

        if (paymentOrdersToUpdate.length > 0) await this.paymentOrderRepository.updateMany(paymentOrdersToUpdate);

        if (coupon) await this.couponRepository.save(coupon);
        this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated(notificationDto);
        if (paymentIntent.status === "succeeded") {
            const ticketDto: PaymentOrderBilledNotificationDto = {
                customerEmail: customer.email,
                foodVAT: Math.round((billedAmount * 0.1 + Number.EPSILON) * 100) / 100,
                orders: [orders[0]],
                paymentOrderHumanNumber: (newPaymentOrders[0].getHumanIdOrIdValue() as string) || "",
                phoneNumber: customer.personalInfo?.phone1 || "",
                shippingAddressCity: "",
                shippingAddressName: customer.getShippingAddress().addressName || "",
                shippingCost: newPaymentOrders[0].shippingCost,
                shippingCustomerName: customer.getPersonalInfo().fullName || "",
                shippingDate: orders[0].getHumanShippmentDay(dto.locale),
                totalAmount: billedAmount,
                discountAmount: newPaymentOrders[0].getDiscountAmountOrShippingCostIfHasFreeShipping(),
            };
            this.notificationService.notifyCustomerAboutPaymentOrderBilled(ticketDto);
        }

        const log: Log = new Log(
            LogType.NEW_SUBSCRIPTION,
            customer.getFullNameOrEmail(),
            "Usuario",
            `Nueva suscripción para el plan ${subscription.plan.name} y variante ${subscription.getPlanVariantLabel(Locale.es)}`,
            `Subscription ${subscription.id.toString()} of ${subscription.plan.name
            } (${subscription.plan.id.toString()}) with variant ${subscription.planVariantId.toString()}`,
            new Date(),
            customer.id
        );
        this.logRepository.save(log);
        return {
            subscription,
            paymentIntent,
            firstOrder: orders[0],
            billedPaymentOrderHumanId: newPaymentOrders[0].getHumanIdOrIdValue(),
            customerPaymentMethods: customer.paymentMethods,
            amountBilled: billedAmount,
            tax:
                Math.round((billedAmount - newPaymentOrders[0].shippingCost) * 0.1) +
                (hasFreeShipping ? 0 : Math.round(newPaymentOrders[0].shippingCost * 0.21)),
            shippingCost: hasFreeShipping ? 0 : newPaymentOrders[0].shippingCost,
        };
    }

    private updateCustomerPersonalInformation(customer: Customer, dto: CreateSubscriptionDto): void {
        customer.changePersonalInfo(
            dto.customerFirstName,
            dto.customerLastName,
            dto.phone1,
            "",
            //@ts-ignore
            customer.personalInfo?.birthDate,
            dto.locale
        );

        !!customer.personalInfo ? (customer.personalInfo.preferredLanguage = dto.locale) : "";
    }

    private updateCustomerShippingAddress(customer: Customer, dto: CreateSubscriptionDto): void {
        const addressIsChanged: boolean =
            !!dto.latitude && !!dto.longitude && customer.hasDifferentLatAndLngAddress(dto.latitude, dto.longitude);


        if (addressIsChanged) {
            customer.changeShippingAddress(
                dto.latitude,
                dto.longitude,
                dto.addressName,
                dto.addressName,
                dto.addressDetails,
                dto.shippingCity,
                dto.shippingProvince,
                dto.shippingCountry,
                dto.shippingPostalCode,
                customer.shippingAddress?.deliveryTime
            );
            customer.changeBillingAddress(
                dto.latitude,
                dto.longitude,
                dto.addressName,
                customer.billingAddress?.customerName || `${dto.customerFirstName} ${dto.customerLastName}`,
                dto.addressDetails,
                customer.billingAddress?.identification || "",
                dto.shippingCity,
                dto.shippingProvince,
                dto.shippingCountry,
                dto.shippingPostalCode,
            );
        }
    }

    private getCustomerShippingZone(customer: Customer, shippingZones: ShippingZone[]): ShippingZone {
        const customerShippingZone = shippingZones.find((zone) =>
            zone.hasAddressInside(customer.shippingAddress?.latitude!, customer.shippingAddress?.longitude!)
        );
        if (!!!customerShippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        return customerShippingZone;
    }

    private async charge(customer: Customer, newPaymentOrders: PaymentOrder[], hasFreeShipping: boolean, customerShippingZoneCost: number, customerSubscriptionsQty: number, orders: Order[], paymentMethodId: string, paymentOrdersWithHumanIdCount: number, stripePaymentMethodId?: string): Promise<number> {
        const paymentOrder = newPaymentOrders[0]
        var paymentIntent: PaymentIntent = {
            id: "",
            status: "succeeded",
            client_secret: "",
        };

        const amountToBill = hasFreeShipping
            ? (Math.round(paymentOrder.getTotalAmount() * 100) - Math.round(customerShippingZoneCost * 100)) / 100
            : paymentOrder.getTotalAmount();


        if (amountToBill >= 0.5) {
            paymentIntent = await this.paymentService.createPaymentIntentAndSetupForFutureUsage(
                amountToBill,
                stripePaymentMethodId ?? customer.getPaymentMethodStripeId(new PaymentMethodId(paymentMethodId)),
                customer.email,
                customer.stripeId
            );
        }

        paymentOrder.paymentIntentId = paymentIntent.id;
        paymentOrder.shippingCost = hasFreeShipping ? 0 : customerShippingZoneCost;

        if (!!paymentIntent && paymentIntent.status === "requires_action") {
            if (customerSubscriptionsQty === 0) this.createFriendCodeService.execute({ customer });
            paymentOrder.toPendingConfirmation(orders);
        } else if (!!paymentIntent && (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "canceled")) {
            await this.paymentService.removePaymentMethodFromCustomer(
                stripePaymentMethodId || customer.getPaymentMethodStripeId(new PaymentMethodId(paymentMethodId))
            );
            throw new Error("El pago ha fallado, por favor intente de nuevo o pruebe con una nueva tarjeta");
        } else {
            paymentOrder?.toBilled(orders, customer);
            paymentOrder ? paymentOrder.addHumanId(paymentOrdersWithHumanIdCount) : "";
            if (customerSubscriptionsQty === 0) this.createFriendCodeService.execute({ customer });
        }

        return amountToBill
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
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter assignOrdersToPaymentOrderService
     * @return {AssignOrdersToPaymentOrders}
     */
    public get assignOrdersToPaymentOrderService(): AssignOrdersToPaymentOrders {
        return this._assignOrdersToPaymentOrderService;
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
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }


    /**
     * Getter createFriendCodeService
     * @return {CreateFriendCode}
     */
    public get createFriendCodeService(): CreateFriendCode {
        return this._createFriendCodeService;
    }

}
