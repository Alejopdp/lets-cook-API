import _ from "lodash";
import Stripe from "stripe";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { CouponId } from "../../domain/cupons/CouponId";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { PaymentMethodId } from "../../domain/customer/paymentMethod/PaymentMethodId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
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
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { AssignOrdersToPaymentOrders } from "../../services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { AssignOrdersToPaymentOrdersDto } from "../../services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrdersDto";
import { AssignOrdersWithDifferentFreqToPaymentOrders } from "../../services/assignOrdersWithDifferentFreqToPaymentOrders/assignOrdersWithDifferentFreqToPaymentOrders";
import { AssignOrdersWithDifferentFreqToPaymentOrdersDto } from "../../services/assignOrdersWithDifferentFreqToPaymentOrders/assignOrdersWithDifferentFreqToPaymentOrdersDto";
import { UpdatePaymentOrdersShippingCostByCustomer } from "../../services/updatePaymentOrdersShippingCostByCustomer/updatePaymentOrdersShippingCostByCustomer";
import { CreateManySubscriptionsDto } from "./createManySubscriptionsDto";

export class CreateManySubscriptions {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _paymentService: IPaymentService;
    private _notificationService: INotificationService;
    private _assignOrdersWithDifferentFreqToPaymentOrders: AssignOrdersWithDifferentFreqToPaymentOrders;
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
        AasignOrdersWithDifferentFreqToPaymentOrders: AssignOrdersWithDifferentFreqToPaymentOrders,
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
        this._assignOrdersWithDifferentFreqToPaymentOrders = AasignOrdersWithDifferentFreqToPaymentOrders;
        this._paymentOrderRepository = paymentOrderRepository;
        this._updatePaymentOrdersShippingCostByCustomer = updatePaymentOrdersShippingCostByCustomer;
    }

    public async execute(
        dto: CreateManySubscriptionsDto
    ): Promise<{ subscription: Subscription; paymentIntent: Stripe.PaymentIntent; firstOrder: Order }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findByIdOrThrow(customerId);
        const plansIds: PlanId[] = dto.plans.map((plan) => new PlanId(plan.planId));
        const plans: Plan[] = await this.planRepository.findAdditionalPlanListById(plansIds, dto.locale);
        const plansMap: { [planId: string]: Plan } = {};
        const frequencySubscriptionMap: { [frequency: string]: Subscription[] } = {};
        const frequencyWeekMap: { [frequency: string]: Week[] } = {};
        const orders: Order[] = [];

        for (let plan of plans) {
            plansMap[plan.id.value] = plan;
        }

        for (let plan of dto.plans) {
            const domainPlan: Plan = plansMap[plan.planId];

            const planVariantId: PlanVariantId = new PlanVariantId(plan.variant.id);
            const frequency: PlanFrequency = (<any>PlanFrequency)[plan.frequency];
            const actualKey = frequencySubscriptionMap[frequency];
            const subscription: Subscription = new Subscription(
                planVariantId,
                domainPlan,
                frequency,
                new SubscriptionActive(),
                " ",
                new Date(),
                customer,
                domainPlan.getPlanVariantPrice(planVariantId),
                undefined,
                undefined,
                undefined,
                undefined,
                new Date() // TO DO: Calculate
            );

            frequencySubscriptionMap[frequency] = Array.isArray(actualKey) ? [...actualKey, subscription] : [subscription];
        }

        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();

        const customerShippingZone: ShippingZone | undefined = shippingZones.find((zone) =>
            zone.hasAddressInside(customer.shippingAddress?.latitude!, customer.shippingAddress?.longitude!)
        );
        if (!!!customerShippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        const frequencySusbcriptionEntries = Object.entries(frequencySubscriptionMap);

        for (let entry of frequencySusbcriptionEntries) {
            const frequency: PlanFrequency = (<any>PlanFrequency)[entry[0]];
            const weeks: Week[] = await this.weekRepository.findNextTwelveByFrequency(frequency);

            for (let subscription of entry[1]) {
                orders.push(...subscription.createNewOrders(customerShippingZone, weeks));
            }
        }

        // console.log("CREATED_ORDERS_FROM_SUBSCRIPTIONS: ", orders);

        const frequencyOrdersMap: { [frequency: string]: Order[] } = {};

        console.log("frequencyOrdersMap: ", frequencyOrdersMap);

        const assignOrdersWithDifferentFreqToPaymentOrdersDto: AssignOrdersWithDifferentFreqToPaymentOrdersDto = {
            frequencyOrdersMap,
            orders,
            frequencyWeeksMap: frequencyWeekMap,
            customerId: customer.id,
            shippingCost: customerShippingZone.cost,
        };

        const { newPaymentOrders, paymentOrdersToUpdate } = await this.assignOrdersWithDifferentFreqToPaymentOrders.execute(
            assignOrdersWithDifferentFreqToPaymentOrdersDto
        );

        // console.log("New payment orders: ", newPaymentOrders);
        // console.log("Payment orders to update: ", paymentOrdersToUpdate);
        // console.log("New Payment orders qty: ", newPaymentOrders.length);
        // console.log("Payment orders to update QTY: ", paymentOrdersToUpdate.length);
        console.log(
            "ORDERS: ",
            orders.filter((order) => !order.paymentOrderId)
        );

        // const paymentIntent = await this.paymentService.paymentIntent(
        //     plan.getPlanVariantPrice(planVariantId),
        //     dto.stripePaymentMethodId
        //         ? dto.stripePaymentMethodId
        //         : customer.getPaymentMethodStripeId(new PaymentMethodId(dto.paymentMethodId)),
        //     customer.email,
        //     customer.stripeId
        // );

        // newPaymentOrders[0]?.toBilled(orders.filter((order) => order.paymentOrderId?.equals(newPaymentOrders[0].id))); // TO DO: Handlear 3dSecure rechazado

        await this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated();
        await this.notificationService.notifyCustomerAboutNewSubscriptionSuccessfullyCreated();
        await this.subscriptionRepository.bulkSave(_.flatten(frequencySusbcriptionEntries.map((entry) => entry[1])));
        await this.orderRepository.bulkSave(orders);
        // await this.customerRepository.save(customer);
        if (newPaymentOrders.length > 0) await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        if (paymentOrdersToUpdate.length > 0) await this.paymentOrderRepository.updateMany(paymentOrdersToUpdate);

        return;
        // return { subscription, paymentIntent, firstOrder: orders[0] };
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
     * @return {AssignOrdersWithDifferentFreqToPaymentOrders}
     */
    public get assignOrdersWithDifferentFreqToPaymentOrders(): AssignOrdersWithDifferentFreqToPaymentOrders {
        return this._assignOrdersWithDifferentFreqToPaymentOrders;
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
