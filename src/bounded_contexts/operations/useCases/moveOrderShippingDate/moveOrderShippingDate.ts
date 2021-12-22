import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderStateFactory } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderFactory";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { MoveOrderShippingDateDto } from "./moveOrderShippingDateDto";

export class MoveOrderShippingDate {
    private _orderRepository: IOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _weekRepository: IWeekRepository;

    constructor(
        orderRepository: IOrderRepository,
        subscriptionRepository: ISubscriptionRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        weekRepository: IWeekRepository
    ) {
        this._orderRepository = orderRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._weekRepository = weekRepository;
    }
    public async execute(dto: MoveOrderShippingDateDto): Promise<Order> {
        const firstOrderId: OrderId = new OrderId(dto.orderId);
        const order: Order = await this.orderRepository.findByIdOrThrow(firstOrderId, Locale.es);
        if (!order.isFirstOrderOfSubscription) throw new Error("No adelantar un pedido que no es el 1ro de una suscripción");

        const [subscription, ordersOfSubscription]: [Subscription, Order[]] = await Promise.all([
            await this.subscriptionRepository.findByIdOrThrow(order.subscriptionId, Locale.es),
            await this.orderRepository.findNextTwelveBySubscription(order.subscriptionId, Locale.es),
        ]);
        const newShippingDateOfFirstOrder = new Date(order.shippingDate);
        newShippingDateOfFirstOrder.setDate(order.shippingDate.getDate() - subscription.frequency.getNumberOfDays());

        if (newShippingDateOfFirstOrder < new Date())
            throw new Error("No puedes adelantar el pedido si el mismo quedaría con una fecha del pasado");
        const currentWeek: Week | undefined = await this.weekRepository.findCurrentWeek(new Date());
        if (!!!currentWeek) throw new Error("No se puede mover la 1er oden");

        const weeks: Week[] = [currentWeek, ...(await this.weekRepository.findNextTwelveByFrequency(subscription.frequency))];

        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByCustomerId(subscription.customer.id);
        const paymentOrdersMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const billingDatePaymentOrderMap: { [billingDate: string]: PaymentOrder } = {};
        const newPaymentOrders: PaymentOrder[] = [];

        // [X] Probar con 1ra suscripicion
        // [X] Probar con 2da suscriptcion
        // [] Probar con suscripciones canceladas
        // [X] Probar con suscripciones slatadas
        // [X] Probar con suscripción existente con cupones
        // [X] Probar con suscripción existente con cupon de cosoto de envio gratis
        // [X] Probar con plan adicional de unica vez y distintas frecuencias

        // Solo permitir esta accion si se está ejecutando en la 1er orden y la misma fue salteada

        for (let paymentOrder of paymentOrders) {
            paymentOrdersMap[paymentOrder.id.value] = paymentOrder;
            billingDatePaymentOrderMap[new Date(paymentOrder.billingDate).toString()] = paymentOrder;
        }

        for (let o of ordersOfSubscription) {
            if (o.shippingDate >= order.shippingDate) {
                const actualPaymentOrder = paymentOrdersMap[o.paymentOrderId?.value!];
                const newPaymentOrderBillingDate = new Date(actualPaymentOrder.billingDate);

                newPaymentOrderBillingDate.setDate(actualPaymentOrder.billingDate.getDate() - subscription.frequency.getNumberOfDays());

                o.shippingDate.setDate(o.shippingDate.getDate() - subscription.frequency.getNumberOfDays());
                const newOrderWeek: Week | undefined = weeks.find((week) => week.containsDate(o.shippingDate));
                if (!!!newOrderWeek) throw new Error(`No existe una semana que contenga la fecha ${o.shippingDate}`);

                o.week = newOrderWeek;

                if (o.isBilled()) continue;

                var newPaymentOrder: PaymentOrder | undefined = billingDatePaymentOrderMap[newPaymentOrderBillingDate.toString()];
                const newPaymentOrderWeek: Week | undefined = weeks.find((week) => week.containsDate(newPaymentOrderBillingDate));
                if (!!!newPaymentOrderWeek)
                    throw new Error(`No existe una semana que contenga la nueva billing date ${newPaymentOrderBillingDate}`);

                if (!!!newPaymentOrder) {
                    newPaymentOrder = new PaymentOrder(
                        o.shippingDate,
                        PaymentOrderStateFactory.createState("PAYMENT_ORDER_ACTIVE"),
                        "",
                        newPaymentOrderBillingDate,
                        newPaymentOrderWeek,
                        o.price,
                        o.discountAmount,
                        actualPaymentOrder.shippingCost,
                        o.customer.id,
                        o.hasFreeShipping,
                        undefined,
                        undefined,
                        actualPaymentOrder.lastRecipeSelectionDate,
                        actualPaymentOrder.humanId
                    );
                    newPaymentOrders.push(newPaymentOrder);
                    o.paymentOrderId = newPaymentOrder.id;
                } else {
                    newPaymentOrder?.addOrder(o);
                }

                o.billingDate = newPaymentOrderBillingDate;
                actualPaymentOrder.discountOrderAmount(o);
            }
        }

        await this.orderRepository.updateMany(ordersOfSubscription);
        await this.paymentOrderRepository.updateMany(paymentOrders);
        if (newPaymentOrders.length > 0) await this.paymentOrderRepository.bulkSave(newPaymentOrders);

        return ordersOfSubscription.find((o) => o.id.equals(order.id))!;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
