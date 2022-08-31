import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { ApplyCouponToSubscriptionDto } from "./applyCouponToSubscriptionDto";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Subscription } from "../../domain/subscription/Subscription";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";
import { Coupon } from "../..//domain/cupons/Cupon";
import { CustomerId } from "../../domain/customer/CustomerId";
import { IsCouponValid } from "../../services/isCouponValid/isCouponValid";
import { IsCouponValidDto } from "../../services/isCouponValid/isCouponValidDto";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Locale } from "../../domain/locale/Locale";

export class ApplyCouponToSubscription {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _couponRepository: ICouponRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _couponValidationService: IsCouponValid;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        couponRepository: ICouponRepository,
        shippingZoneRepository: IShippingZoneRepository,
        couponValidationService: IsCouponValid
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._couponRepository = couponRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._couponValidationService = couponValidationService;
    }

    public async execute(dto: ApplyCouponToSubscriptionDto): Promise<void> {
        const customerId = new CustomerId(dto.customerId);
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId, Locale.es);
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription | undefined = customerSubscriptions.find((sub) => sub.id.equals(subscriptionId));
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAllActive();
        const customerShippingZone: ShippingZone | undefined = shippingZones.find((zone) =>
            zone.hasAddressInside(
                customerSubscriptions[0].customer.shippingAddress?.latitude!,
                customerSubscriptions[0].customer?.shippingAddress?.longitude!
            )
        );

        if (!!!customerShippingZone) throw new Error("El cliente no está dentro de ninguna zona de envío habilitada");

        const coupon: Coupon | undefined = await this.couponRepository.findActiveByCode(dto.couponCode);
        if (!!!coupon) throw new Error("El cupón ingresado no existe o está desactivado");

        const isCouponValidDto: IsCouponValidDto = {
            coupon,
            customerSubscriptions,
            plan: subscription.plan,
            planVariantId: subscription.planVariantId,
            shippingCost: customerShippingZone.cost,
        };
        await this.couponValidationService.execute(isCouponValidDto);

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));

        subscription.addCoupon(orders, paymentOrders, coupon, customerShippingZone.cost);

        await this.orderRepository.updateMany(orders); // TO DO: Transaction / Queue
        await this.paymentOrderRepository.updateMany(paymentOrders); // TO DO: Transaction / Queue
        await this.subscriptionRepository.save(subscription); // TO DO: Transaction / Queue
        await this.couponRepository.save(coupon);
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
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Getter couponValidationService
     * @return {IsCouponValid}
     */
    public get couponValidationService(): IsCouponValid {
        return this._couponValidationService;
    }
}
