import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderStateFactory } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderFactory";
import { IPlanFrequency } from "../../domain/plan/PlanFrequency/IPlanFrequency";
import { PlanFrequencyFactory } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Week } from "../../domain/week/Week";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { ChangeSubscriptionFrequencyDto } from "./changeSubscriptionFrequencyDto";

export class ChangeSubscriptionFrequency {
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _weekRepository: IWeekRepository;

    constructor(
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        subscriptionRepository: ISubscriptionRepository,
        weekRepository: IWeekRepository
    ) {
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._weekRepository = weekRepository;
    }

    public async execute(dto: ChangeSubscriptionFrequencyDto): Promise<void> {
        const newFrequency: IPlanFrequency = PlanFrequencyFactory.createPlanFrequency(dto.frequency);
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const [subscription, orders, weeks]: [Subscription, Order[], Week[]] = await Promise.all([
            this.subscriptionRepository.findByIdOrThrow(subscriptionId, dto.locale),
            this.orderRepository.findNextTwelveBySubscription(subscriptionId, dto.locale),
            this.weekRepository.findAll(),
        ]);
        const allCustomerPaymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByCustomerId(subscription.customer.id);
        const allPaymentOrdersBillingDateMap = new Map<string, PaymentOrder>();
        const paymentOrdersMap = new Map<string, PaymentOrder>();
        const newPaymentOrders: PaymentOrder[] = [];

        for (const paymentOrder of allCustomerPaymentOrders) {
            const billingDate = paymentOrder.billingDate;
            allPaymentOrdersBillingDateMap.set(
                `${billingDate.getFullYear()}${billingDate.getMonth()}${billingDate.getDate()}`,
                paymentOrder
            );
            paymentOrdersMap.set(paymentOrder.id.toString(), paymentOrder);
        }

        subscription.frequency = newFrequency;
        const saturdayOfWeek = new Date(orders[0].billingDate).getDate() - orders[0].billingDate.getDay() + 6;
        const saturday = new Date(orders[0].billingDate.setDate(saturdayOfWeek));
        const nextSaturday: Date = orders[0].billingDate.getDay() === 6 ? orders[0].billingDate : saturday;
        const newBillingDates: Date[] = subscription.frequency.getNDatesWithFrequencyOffset(orders.length, nextSaturday);
        const newShippingDates: Date[] = subscription.frequency.getNDatesWithFrequencyOffset(orders.length, orders[0].shippingDate);

        console.log("SATURDAY: ", nextSaturday);

        for (let i = 0; i < orders.length; i++) {
            if (orders[i]?.isBilled()) continue;
            const billingDate = newBillingDates[i];
            const alreadyExistsAPaymentOrderWithNewBillingDate: boolean = !!allPaymentOrdersBillingDateMap.get(
                `${billingDate.getFullYear()}${billingDate.getMonth()}${billingDate.getDate()}`
            );
            let order = orders[i];
            const oldPaymentOrder: PaymentOrder | undefined = paymentOrdersMap.get(order.paymentOrderId!.toString());
            if (!oldPaymentOrder) throw new Error(`No se encontró una payment order para la order: ${order.id.toString()}`);
            const oldPaymentOrderBillingDateKey = `${oldPaymentOrder.billingDate.getFullYear()}${oldPaymentOrder.billingDate.getMonth()}${oldPaymentOrder.billingDate.getDate()}`;
            const oldPaymentOrderToUpdate: PaymentOrder = allPaymentOrdersBillingDateMap.get(oldPaymentOrderBillingDateKey)!;
            const newPaymentOrder: PaymentOrder =
                allPaymentOrdersBillingDateMap.get(`${billingDate.getFullYear()}${billingDate.getMonth()}${billingDate.getDate()}`) ??
                new PaymentOrder(
                    newShippingDates[i],
                    PaymentOrderStateFactory.createState("PAYMENT_ORDER_ACTIVE"),
                    "",
                    billingDate,
                    weeks.find((week) => week.containsDate(billingDate))!,
                    order.price,
                    order.discountAmount,
                    oldPaymentOrder.shippingCost,
                    order.customer.id,
                    oldPaymentOrder.hasFreeShipping
                );

            oldPaymentOrderToUpdate.discountOrderAmount(order);
            order.shippingDate = newShippingDates[i];
            order.billingDate = newBillingDates[i];
            order.paymentOrderId = newPaymentOrder.id;

            if (!alreadyExistsAPaymentOrderWithNewBillingDate) {
                newPaymentOrders.push(newPaymentOrder);
            } else {
                newPaymentOrder.addOrder(order);
            }
        }

        await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        await this.paymentOrderRepository.updateMany(
            allCustomerPaymentOrders.filter((paymentOrder) => paymentOrder.billingDate.getTime() > new Date().getTime())
        );
        await this.orderRepository.updateMany(orders);
        await this.subscriptionRepository.save(subscription);
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
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
