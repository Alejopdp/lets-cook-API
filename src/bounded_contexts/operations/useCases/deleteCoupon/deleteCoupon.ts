import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { DeleteCouponDto } from "./deleteCouponDto";
import { Coupon } from "../../domain/cupons/Cupon";
import { CouponId } from "../../domain/cupons/CouponId";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { CouponState } from "../../domain/cupons/CouponState";

export class DeleteCoupon {
    private _couponRepository: ICouponRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(
        couponRepository: ICouponRepository,
        subscriptionRepository: ISubscriptionRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        orderRepository: IOrderRepository
    ) {
        this._couponRepository = couponRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: DeleteCouponDto): Promise<any> {
        const coupon: Coupon = await this.couponRepository.findByIdOrThrow(new CouponId(dto.couponId));
        if (coupon.state === CouponState.DELETED) throw new Error("El cupón ya fue eliminado");

        const subscriptionsWithCoupon = await this.subscriptionRepository.findByCouponId(coupon.id);
        const nonBilledOrdersOfSubscriptionsWithCoupon = await this.orderRepository.findActiveBySubscriptionIdList(
            subscriptionsWithCoupon.map((sub) => sub.id)
        );
        const nonBilledPaymentOrders = await this.paymentOrderRepository.findByIdList(
            nonBilledOrdersOfSubscriptionsWithCoupon.reduce(
                (acc, order) => (order.paymentOrderId ? [...acc, order.paymentOrderId] : acc),
                [] as PaymentOrderId[]
            )
        );
        const paymentOrderMap: { [paymentOrderId: string]: PaymentOrder } = {};

        for (let po of nonBilledPaymentOrders) {
            paymentOrderMap[po.id.toString()] = po;
        }

        for (let order of nonBilledOrdersOfSubscriptionsWithCoupon) {
            order.removeDiscountAmount(paymentOrderMap[order.paymentOrderId?.value!]);
        }

        coupon.state = CouponState.DELETED; // Push to a domain method

        await this.orderRepository.updateMany(nonBilledOrdersOfSubscriptionsWithCoupon);
        await this.paymentOrderRepository.updateMany(nonBilledPaymentOrders);
        await this.couponRepository.save(coupon);
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
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
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
