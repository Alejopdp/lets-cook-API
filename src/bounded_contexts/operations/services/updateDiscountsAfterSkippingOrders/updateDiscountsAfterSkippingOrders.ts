import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { UpdateDiscountAfterSkippingOrdersDto } from "./updateDiscountAfterSkippingOrdersDto";

export class UpdateDiscountAfterSkippingOrders {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _shippingZoneRepository: IShippingZoneRepository;


    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository, paymentOrderRepository: IPaymentOrderRepository, shippingZoneRepository: IShippingZoneRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._shippingZoneRepository = shippingZoneRepository;
    }


    public async execute(dto: UpdateDiscountAfterSkippingOrdersDto): Promise<void> {
        const subscriptionId = new SubscriptionId(dto.subscriptionId)
        const [subscription, futureOrders] = await Promise.all([this.subscriptionRepository.findByIdOrThrow(subscriptionId, Locale.es), this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es)])
        // if (subscription.coupon?.maxChargeQtyType === "only_fee") return

        const [paymentOrders, shippingZones] = await Promise.all([this.paymentOrderRepository.findByIdList(futureOrders.map(o => o.paymentOrderId!)), this.shippingZoneRepository.findAllActive()])
        const customerShippingZone = shippingZones.find(zone => zone.hasAddressInside(subscription?.customer.shippingAddress?.latitude ?? -1, subscription?.customer.shippingAddress?.longitude ?? -1))
        if (!customerShippingZone) throw new Error("Tu direccion no se encuentra en ninguna de nuestras zonas de envio")

        const skippedOrdersQty = futureOrders.filter(order => order.isSkipped()).length
        const activeOrdersQty = futureOrders.length - skippedOrdersQty
        var couponRemainingApplicationQty = (subscription?.coupon?.maxChargeQtyValue ?? 0) - (subscription?.couponChargesQtyApplied ?? 0)
        const discountAmount = subscription.getCouponDiscount(customerShippingZone.cost)

        if (couponRemainingApplicationQty >= activeOrdersQty || subscription.coupon?.maxChargeQtyType === "all_fee") {
            this.addDiscountAmountToActiveOrders(subscription, futureOrders, paymentOrders, discountAmount)

        }

        if (couponRemainingApplicationQty < activeOrdersQty) {
            this.reassignDiscountAmountsToOrdersSortedByDate(subscription, futureOrders, paymentOrders, discountAmount, couponRemainingApplicationQty)
        }

        await this.orderRepository.updateMany(futureOrders)
        await this.paymentOrderRepository.updateMany(paymentOrders)
        await this.subscriptionRepository.save(subscription)

    }

    // Si hay una orden activa sin descuento y una futura con, el descuento pasa a la primera
    // 

    private reassignDiscountAmountsToOrdersSortedByDate(subscription: Subscription, orders: Order[], paymentOrders: PaymentOrder[], discountAmount: number, couponRemainingApplicationQty: number): void {
        const sortedOrdersDesc = [...orders]
        sortedOrdersDesc.sort((o1, o2) => o1.shippingDate < o2.shippingDate ? 1 : -1)

        for (const order of orders) {
            if (!order.isActive()) continue
            const relatedPaymentOrder = paymentOrders.find(po => po.id.equals(order.paymentOrderId!)) // TODO: Optimize it with a map
            if (!relatedPaymentOrder) throw new Error("No se encontro una po relacionada")
            const hasNotADiscount = order.discountAmount === 0
            const futureOrderWithDiscount = orders.find(o => o.isActive() && o.billingDate > order.billingDate && o.discountAmount > 0)

            if (hasNotADiscount && (futureOrderWithDiscount || couponRemainingApplicationQty > 0)) {
                order.discountAmount = discountAmount
                relatedPaymentOrder.addDiscountAmount(order.discountAmount)
                couponRemainingApplicationQty--
                subscription.couponChargesQtyApplied++

                if (futureOrderWithDiscount) {
                    const relatedFuturePaymentOrder = paymentOrders.find(po => po.id.equals(futureOrderWithDiscount.paymentOrderId!)) // TODO: Optimize it with a map
                    if (!relatedFuturePaymentOrder) throw new Error("No se encontro una po futura relacionada")

                    relatedFuturePaymentOrder.discountDiscountAmount(futureOrderWithDiscount.discountAmount)
                    futureOrderWithDiscount.discountAmount = 0
                    subscription.couponChargesQtyApplied--

                }


            }
        }

    }

    private addDiscountAmountToActiveOrders(subscription: Subscription, orders: Order[], paymentOrders: PaymentOrder[], discountAmount: number): void {

        for (const order of orders) {
            if (!order.isActive() || order.discountAmount > 0) continue
            const relatedPaymentOrder = paymentOrders.find(po => po.id.equals(order.paymentOrderId!)) // TODO: Optimize it with a map
            if (!relatedPaymentOrder) throw new Error("No se encontro una po relacionada")

            order.discountAmount = discountAmount
            relatedPaymentOrder.discountAmount = relatedPaymentOrder.discountAmount + order.discountAmount
            subscription.couponChargesQtyApplied++

        }
    }
    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
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

}