import { Handle3dSecureFailureDto } from "./handle3dSecureFailureDto";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { Locale } from "../../domain/locale/Locale";

export class Handle3dSecureFailure {
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;
    private _customerRepository: ICustomerRepository;
    private _couponRepository: ICouponRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        orderRepository: IOrderRepository,
        customerRepository: ICustomerRepository,
        couponRepository: ICouponRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
        this._customerRepository = customerRepository;
        this._couponRepository = couponRepository;
    }

    public async execute(dto: Handle3dSecureFailureDto): Promise<void> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(dto.currentCustomer.id, Locale.es);
        const subscription: Subscription | undefined = customerSubscriptions.find((sub) => sub.id.equals(subscriptionId));
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es, dto.queryDate);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));

        subscription.cancel(new CancellationReason("Método de pago no confirmado", ""), orders, paymentOrders);
        if (customerSubscriptions.length === 1) {
            await this.couponRepository.deleteByCode(subscription.customer.friendCode!);
            subscription.customer.friendCode = undefined;
        }

        await this.subscriptionRepository.destroy(subscription.id);
        await this.paymentOrderRepository.updateMany(paymentOrders);
        // await this.orderRepository.saveCancelledOrders(orders);
        await this.orderRepository.destroyManyBySubscriptionId(subscription.id);
        await this.customerRepository.save(subscription.customer);
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

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }
}
