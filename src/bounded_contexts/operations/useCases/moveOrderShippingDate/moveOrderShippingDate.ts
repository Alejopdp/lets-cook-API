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
        const daysForMovingOrder = 7;
        const firstOrderId: OrderId = new OrderId(dto.orderId);
        const order: Order = await this.orderRepository.findByIdOrThrow(firstOrderId, Locale.es);
        if (!order.isFirstOrderOfSubscription) throw new Error("No puedes adelantar un pedido que no es el 1ro de una suscripción");

        const [subscription, ordersOfSubscription]: [Subscription, Order[]] = await Promise.all([
            await this.subscriptionRepository.findByIdOrThrow(order.subscriptionId, Locale.es),
            await this.orderRepository.findNextTwelveBySubscription(order.subscriptionId, Locale.es, dto.queryDate),
        ]);
        const newShippingDateOfFirstOrder = new Date(order.shippingDate);
        newShippingDateOfFirstOrder.setDate(order.shippingDate.getDate() - daysForMovingOrder);

        if (order.hasBeenMovedOneWeekForward) throw new Error("El pedido ya ha sido movido una semana");
        const currentWeek: Week | undefined = await this.weekRepository.findCurrentWeek(new Date());
        if (!!!currentWeek) throw new Error("No se puede mover la 1er oden");

        const weeks: Week[] = [currentWeek, ...(await this.weekRepository.findAll())]; // TO DO: Only search for the needed ones

        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByCustomerId(subscription.customer.id);
        const paymentOrdersMap = new Map<string, PaymentOrder>()
        const billingDatePaymentOrderMap: { [billingDate: string]: PaymentOrder } = {};
        const newPaymentOrders: PaymentOrder[] = [];

        // [X] Probar con 1ra suscripicion
        // [X] Probar con 2da suscriptcion
        // [X] Probar con suscripciones canceladas
        // [X] Probar con suscripciones slatadas
        // [X] Probar con suscripción existente con cupones
        // [X] Probar con suscripción existente con cupon de cosoto de envio gratis
        // [X] Probar con plan adicional de unica vez y distintas frecuencias
        // [] Si hoy es miercoles y quiero adelantar un martes, debería dejarme, preguntar a santi

        for (let paymentOrder of paymentOrders) {
            paymentOrdersMap.set(paymentOrder.id.toString(), paymentOrder)
            billingDatePaymentOrderMap[new Date(paymentOrder.billingDate).toString()] = paymentOrder;
        }

        for (let order of ordersOfSubscription) {
            if (order.shippingDate >= order.shippingDate) {
                const actualPaymentOrder = paymentOrdersMap.get(order.paymentOrderId?.toString()!)!
                const newPaymentOrderBillingDate = new Date(actualPaymentOrder.billingDate)
                newPaymentOrderBillingDate.setDate(actualPaymentOrder.billingDate.getDate() - daysForMovingOrder);

                var newPaymentOrder: PaymentOrder | undefined = billingDatePaymentOrderMap[newPaymentOrderBillingDate.toString()];


                order.shippingDate.setDate(order.shippingDate.getDate() - daysForMovingOrder);
                const newOrderWeek: Week | undefined = weeks.find((week) => week.containsDate(order.shippingDate));
                if (!!!newOrderWeek) throw new Error(`No existe una semana que contenga la fecha ${order.shippingDate}`);

                order.week = newOrderWeek;

                if (order.isFirstOrderOfSubscription) order.hasBeenMovedOneWeekForward = true;
                if (order.isBilled()) continue;

                const newPaymentOrderWeek: Week | undefined = weeks.find((week) => week.containsDate(newPaymentOrderBillingDate));
                if (!!!newPaymentOrderWeek)
                    throw new Error(`No existe una semana que contenga la nueva billing date ${newPaymentOrderBillingDate}`);

                if (!!!newPaymentOrder) {
                    console.log("Esto tiene que aparecer una vez: ")
                    newPaymentOrder = new PaymentOrder(
                        order.shippingDate,
                        PaymentOrderStateFactory.createState(actualPaymentOrder.state.title),
                        "",
                        newPaymentOrderBillingDate,
                        newPaymentOrderWeek,
                        order.price,
                        order.discountAmount,
                        actualPaymentOrder.shippingCost,
                        order.customer.id,
                        order.hasFreeShipping,
                        undefined,
                        undefined,
                        actualPaymentOrder.lastRecipeSelectionDate,
                        actualPaymentOrder.humanId
                    );
                    newPaymentOrders.push(newPaymentOrder);
                    order.paymentOrderId = newPaymentOrder.id;
                } else {
                    newPaymentOrder?.addOrder(order);
                    newPaymentOrder.state = PaymentOrderStateFactory.createState(actualPaymentOrder.state.title) // TO DO: This state change overrides an unwanted state chanege in the method above (Cancelled POs to Active). Encapsulate this logic within it.

                }

                order.billingDate = newPaymentOrderBillingDate;
                actualPaymentOrder.discountOrderAmount(order);
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
