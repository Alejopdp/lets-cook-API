import { UpdateSubscriptionCouponDto } from "./updateSubscriptionCouponDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeRestrictionId } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { IRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction/IRecipeRestrictionRepository";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { INotificationService } from "@src/shared/notificationService/INotificationService";
import { Locale } from "../../domain/locale/Locale";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Coupon } from "../../domain/cupons/Cupon";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { IsCouponValid } from "../../services/isCouponValid/isCouponValid";
import { CustomerId } from "../../domain/customer/CustomerId";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ShippingZone } from "../../domain/shipping/ShippingZone";

export class UpdateSubscriptionCoupon {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _couponRepository: ICouponRepository;
    private _couponValidationService: IsCouponValid;
    private _shippingZoneRepository: IShippingZoneRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        couponRepository: ICouponRepository,
        couponValidationService: IsCouponValid,
        shippingZoneRepository: IShippingZoneRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._couponRepository = couponRepository;
        this._couponValidationService = couponValidationService;
        this._shippingZoneRepository = shippingZoneRepository;
    }

    public async execute(dto: UpdateSubscriptionCouponDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const coupon: Coupon | undefined = await this.couponRepository.findActiveByCode(dto.couponCode);
        if (!!!coupon) throw new Error("El cupón ingresado no existe");

        const [customerSubscriptions, shippingZones]: [Subscription[], ShippingZone[]] = await Promise.all([
            this.subscriptionRepository.findActiveSusbcriptionsByCustomerId(customerId),
            this.shippingZoneRepository.findAll(),
        ]);
        const subscription: Subscription | undefined = customerSubscriptions.find((sub) => sub.id.equals(subscriptionId));
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        const customerShippingZone: ShippingZone = shippingZones.find((zone) =>
            zone.hasAddressInside(
                subscription.customer.getShippingAddress().latitude!,
                subscription.customer.getShippingAddress().longitude!
            )
        )!;

        await this.couponValidationService.execute({
            coupon,
            customerSubscriptions,
            plan: subscription.plan,
            planVariantId: subscription.planVariantId,
            shippingCost: customerShippingZone.cost,
        });
        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));

        // subscription.updateCoupon(coupon, orders, paymentOrders, customerShippingZone.cost);

        await this.subscriptionRepository.save(subscription);
        await this.orderRepository.updateMany(orders);
        await this.paymentOrderRepository.updateMany(paymentOrders);
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
     * Getter couponValidationService
     * @return {IsCouponValid}
     */
    public get couponValidationService(): IsCouponValid {
        return this._couponValidationService;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }
}
