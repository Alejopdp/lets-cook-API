import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { PaymentOrderStateFactory } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderFactory";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { ChargeOnePaymentOrderDto } from "./chargeOnePaymentOrderDto";

export class ChargeOnePaymentOrder {
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _weekRepository: IWeekRepository;
    private _paymentService: IPaymentService;

    constructor(
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        shippingZoneRepository: IShippingZoneRepository,
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        weekRepository: IWeekRepository,
        paymentService: IPaymentService
    ) {
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._weekRepository = weekRepository;
        this._paymentService = paymentService;
    }
    public async execute(dto: ChargeOnePaymentOrderDto): Promise<{ paymentIntentId: string; paymentOrderState: string }> {
        const paymentOrderId: PaymentOrderId = new PaymentOrderId(dto.paymentOrderId);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(paymentOrderId);
        if (paymentOrder.state.isBilled()) throw new Error("La orden ya fue cobrada");

        const orders: Order[] = await this.orderRepository.findActiveOrdersByPaymentOrderId(paymentOrderId);
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(
            orders.map((order) => order.subscriptionId)
        );
        const customer: Customer = await this.customerRepository.findByIdOrThrow(paymentOrder.customerId);
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const weeklyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveWeeksLater();
        const biweeklyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveBiweeksLater();
        const monthlyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveMonthsLater();
        const frequencyWeekMap: { [frequency: string]: Week } = {};
        const customerShippingZone: ShippingZone | undefined = shippingZones.find((zone) =>
            zone.hasAddressInside(customer.shippingAddress?.latitude || 0, customer.shippingAddress?.longitude || 0)
        );
        if (!!!customerShippingZone) throw new Error("El cliente no pertenece a ninguna zona de envío válida");

        const shippingCost: number = customerShippingZone.cost;

        if (!!!weeklyOrdersWeek || !!!biweeklyOrdersWeek || !!!monthlyOrdersWeek)
            throw new Error("Error al obtener las semanas para una nueva orden");

        frequencyWeekMap["weekly"] = weeklyOrdersWeek;
        frequencyWeekMap["biweekly"] = biweeklyOrdersWeek;
        frequencyWeekMap["monthly"] = monthlyOrdersWeek;

        const customerHasFreeShipping = orders.some((order) => order.hasFreeShipping);
        const totalAmount = customerHasFreeShipping
            ? (paymentOrder.amount * 100 - paymentOrder.discountAmount * 100) / 100
            : (paymentOrder.amount * 100 - paymentOrder.discountAmount * 100 + shippingCost * 100) / 100;

        const paymentIntent = await this.paymentService.paymentIntent(
            totalAmount,
            customer.getDefaultPaymentMethod()?.stripeId!,
            customer.email,
            customer.stripeId as string
        );

        // TO DO: Handlear insuficiencia de fondos | pagos rechazados | etc
        if (paymentIntent.status === "succeeded") {
            paymentOrder.toBilled(orders);
        } else {
            paymentOrder.toRejected(orders);
        }

        paymentOrder.paymentIntentId = paymentIntent.id;

        const newOrders: Order[] = [];
        for (let subscription of customerSubscriptions) {
            if (subscription.frequency.isOneTime()) {
                // TO DO: End subscription
            } else {
                const newOrder = subscription.getNewOrderAfterBilling(
                    orders.find((order) => order.subscriptionId.equals(subscription.id))!,
                    frequencyWeekMap[subscription.frequency.value()],
                    customerShippingZone
                );

                newOrders.push(newOrder);
            }
        }

        const newPaymentOrders: PaymentOrder[] = [];
        const billingDateOrdersMap: { [billingDate: string]: Order[] } = {};

        // NEW PAYMENT ORDERS && PAYMENT ORDER ASSIGNMENT BY BILLINGDATE

        for (let order of newOrders) {
            const billingDateTime: string = order.billingDate.toString();

            billingDateOrdersMap[billingDateTime] = Array.isArray(billingDateOrdersMap[billingDateTime])
                ? [...billingDateOrdersMap[billingDateTime], order]
                : [order];
        }

        for (let billingDateAndOrders of Object.entries(billingDateOrdersMap)) {
            const ordersAmount = billingDateAndOrders[1].reduce((acc, order) => (acc * 100 + order.getTotalPrice() * 100) / 100, 0);
            const ordersDiscount = billingDateAndOrders[1].reduce((acc, order) => (acc * 100 + order.discountAmount * 100) / 100, 0);

            const newPaymentOrder = new PaymentOrder(
                new Date(),
                PaymentOrderStateFactory.createState("PAYMENT_ORDER_ACTIVE"),
                "",
                new Date(billingDateAndOrders[0]),
                weeklyOrdersWeek, // TO DO: Week is unnecessary in payment orders
                ordersAmount,
                ordersDiscount,
                customerShippingZone.cost,
                customer.id
            );

            newPaymentOrders.push(newPaymentOrder);
            billingDateAndOrders[1].forEach((order) => (order.paymentOrderId = newPaymentOrder.id));
        }

        await this.orderRepository.saveOrdersWithNewState(orders);
        await this.orderRepository.bulkSave(newOrders);
        await this.paymentOrderRepository.save(paymentOrder);
        await this.paymentOrderRepository.bulkSave(newPaymentOrders);

        return { paymentIntentId: paymentOrder.paymentIntentId, paymentOrderState: paymentOrder.state.title };
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
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
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
