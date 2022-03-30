import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderStateFactory } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderFactory";
import { IPlanFrequency } from "../../domain/plan/PlanFrequency/IPlanFrequency";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Week } from "../../domain/week/Week";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { MoveNextBillingDateDto } from "./moveNextBillingDateDto";

export class MoveNextBillingDate {
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

    // [X] Validar que la fecha de cobro sea un sábado
    // [X] Obtener frecuencia de suscri
    // [X] Obtener lista de nuevas billing dates
    // [X] Obtener lista de nuevas shipping dates
    // [X] Cambiar shipping date a la semana del primer cobro
    // [X] Cambiar shipping date del resto de ordenes en base a la frecuencia
    // [X] Cambiar billing date de todas las payment orders
    // [] QUE PASA CON LA ORDER QUE ESTÄ BILLED
    // [] Qué pasa con ordenes skipeadas?
    // [] Payment order canceladas, nuevas, etc
    // [] Obtener semana para nueva payment order
    // [] Que pasa con las nuevas payment orders que se crean y los cupones con X cargos de descuento
    // [] Como se comporta con el cobrar ahora?
    // Si quedan ordenes para una semana solo con adicional, saltar las semanas

    public async execute(dto: MoveNextBillingDateDto): Promise<any> {
        if (dto.nextBillingDate.getDay() !== 6) throw new Error("No puedes elegir una fecha que no sea un sábado");
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const [subscription, orders, weeks]: [Subscription, Order[], Week[]] = await Promise.all([
            this.subscriptionRepository.findByIdOrThrow(subscriptionId, dto.locale),
            this.orderRepository.findFutureActiveAndSkippedBySubscriptionOrderdByShippingDate(subscriptionId, dto.locale),
            this.weekRepository.findAll(),
        ]);
        const [ordersPaymentOrders, allCustomerPaymentOrders]: [PaymentOrder[], PaymentOrder[]] = await Promise.all([
            this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!)),
            this.paymentOrderRepository.findNextTwelveByCustomer(subscription.customer.id),
        ]);
        const allPaymentOrdersBillingDateMap = new Map<string, PaymentOrder>();
        const paymentOrdersMap = new Map<string, PaymentOrder>();
        const newPaymentOrders: PaymentOrder[] = [];

        for (const paymentOrder of allCustomerPaymentOrders) {
            const billingDate = paymentOrder.billingDate;
            allPaymentOrdersBillingDateMap.set(
                `${billingDate.getFullYear()}${billingDate.getMonth()}${billingDate.getDate()}`,
                paymentOrder
            );
        }

        for (const paymentOrder of ordersPaymentOrders) {
            paymentOrdersMap.set(paymentOrder.id.toString(), paymentOrder);
        }

        const auxDate: Date = new Date(dto.nextBillingDate.getTime());

        const nextShippingDate: Date = new Date(
            auxDate.setDate(auxDate.getDate() + ((7 + orders[0].shippingDate.getDay() - auxDate.getDay() - 1) % 7) + 1)
        );
        const newBillingDates: Date[] = subscription.frequency.getNDatesWithFrequencyOffset(orders.length, dto.nextBillingDate);
        const newShippingDates: Date[] = subscription.frequency.getNDatesWithFrequencyOffset(orders.length, nextShippingDate);

        for (let i = 0; i < orders.length; i++) {
            // TO DO: If there is an error here, check the "FIND NEXT TWELVE METHODS"
            const billingDate = newBillingDates[i];
            const alreadyExistsAPaymentOrderWithNewBillingDate: boolean = !!allPaymentOrdersBillingDateMap.get(
                `${billingDate.getFullYear()}${billingDate.getMonth()}${billingDate.getDate()}`
            );
            let order = orders[i];
            const oldPaymentOrder: PaymentOrder = paymentOrdersMap.get(order.paymentOrderId!.toString())!;
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

            oldPaymentOrder.discountOrderAmount(order);
            order.shippingDate = newShippingDates[i];
            order.billingDate = newBillingDates[i];
            order.paymentOrderId = newPaymentOrder.id;

            if (!alreadyExistsAPaymentOrderWithNewBillingDate) {
                newPaymentOrders.push(newPaymentOrder);
            } else {
                newPaymentOrder.addOrder(order);
            }
        }

        console.log("NEW BILLING DATES: ", JSON.stringify(newBillingDates));
        console.log("NEW SHIPPING DATES: ", JSON.stringify(newShippingDates));
        console.log("NEW ORDERS SHIPPING DATES: ", JSON.stringify(orders.map((o) => o.shippingDate)));

        // await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        // await this.paymentOrderRepository.updateMany(ordersPaymentOrders);
        // await this.orderRepository.updateMany(orders);
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
