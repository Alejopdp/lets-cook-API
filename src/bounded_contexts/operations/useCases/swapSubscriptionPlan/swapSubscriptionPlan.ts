import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { SwapSubscriptionPlanDto } from "./swapSubscriptionPlanDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { PlanId } from "../../domain/plan/PlanId";
import { Plan } from "../../domain/plan/Plan";
import { Locale } from "../../domain/locale/Locale";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { Coupon } from "../../domain/cupons/Cupon";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";

export class SwapSubscriptionPlan {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _planRepository: IPlanRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _couponRepository: ICouponRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _logRepository: ILogRepository;
    private _recipesRatingRepository: IRateRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        planRepository: IPlanRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        couponRepository: ICouponRepository,
        shippingZoneRepository: IShippingZoneRepository,
        logRepository: ILogRepository,
        recipesRatingRepository: IRateRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._planRepository = planRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._couponRepository = couponRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._logRepository = logRepository;
        this._recipesRatingRepository = recipesRatingRepository;
    }

    public async execute(dto: SwapSubscriptionPlanDto): Promise<void> {
        const newPlanId: PlanId = new PlanId(dto.newPlanId);
        const newPlanVariantId: PlanVariantId = new PlanVariantId(dto.newPlanVariantId);
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription | undefined = await this.subscriptionRepository.findById(subscriptionId, Locale.es);
        const customerRatings: RecipeRating[] = await this.recipesRatingRepository.findAllByCustomer(subscription?.customer.id!, Locale.es);
        const recipeRatingsMap: { [recipeId: string]: RecipeRating } = {};
        if (!!!subscription) throw new Error("La subscripción ingresada no existe");
        if (subscription.state.isCancelled()) throw new Error("No puedes cambiar el plan de una suscripción cancelada");

        const shippingZones = await this.shippingZoneRepository.findAll();

        const customerShippingZone = shippingZones.find((zone) =>
            zone.hasAddressInside(subscription.customer.shippingAddress?.latitude!, subscription.customer.shippingAddress?.longitude!)
        );
        if (!customerShippingZone) throw new Error("No te encuentras en una zona de envío disponible");
        const oldSubscriptionPrice = subscription.plan.getPlanVariantPrice(subscription.planVariantId);
        const oldPlan = subscription.plan;
        const oldPlanVariantId = subscription.planVariantId;

        const newPlan: Plan | undefined = await this.planRepository.findById(newPlanId, Locale.es);
        if (!!!newPlan) throw new Error("El nuevo plan al que te quieres suscribir no existe");

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es);

        for (let rating of customerRatings) {
            recipeRatingsMap[rating.recipe.id.value] = rating;
        }

        for (let order of orders) {
            for (let selection of order.recipeSelection) {
                const rating = recipeRatingsMap[selection.recipe.id.value];

                rating?.removeOneDelivery(order.shippingDate);
            }
        }

        subscription.swapPlan(orders, newPlan, newPlanVariantId, customerShippingZone.cost);

        // UPDATE PAYEMNT ORDERS COST
        if (oldSubscriptionPrice !== subscription.price) {
            const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(
                orders.map((order) => order.paymentOrderId!)
            );
            const coupon: Coupon | undefined = subscription.coupon
                ? await this.couponRepository.findById(subscription.coupon.id)
                : undefined;

            for (let paymentOrder of paymentOrders) {
                var oldPlanDiscount = !!coupon ? coupon.getDiscount(oldPlan, oldPlanVariantId, paymentOrder.shippingCost) : 0;
                var newPlanDiscount = !!coupon ? coupon.getDiscount(newPlan, newPlanVariantId, paymentOrder.shippingCost) : 0;

                paymentOrder.updateAmountsAfterSwappingPlan(oldSubscriptionPrice, subscription.price, oldPlanDiscount, newPlanDiscount);
            }

            await this.paymentOrderRepository.updateMany(paymentOrders);
        }

        await this.orderRepository.updateMany(orders);
        await this.subscriptionRepository.save(subscription); // TO DO: Transaction / Queue
        this.recipesRatingRepository.updateMany(customerRatings);
        this.logRepository.save(
            new Log(
                LogType.PURCHASE_ITEM_SWAP,
                subscription.customer.getFullNameOrEmail(),
                "Usuario",
                `El usuario cambió la suscripción del ${oldPlan.name} al ${
                    subscription.plan.name
                } con variante ${subscription.getPlanVariantLabel(Locale.es)}`,
                `El usuario cambió la suscripción (${subscription.id.toString()}) del plan ${oldPlan.id.toString()} al plan ${subscription.plan.id.toString()} con variante ${subscription.planVariantId.toString()}`,
                new Date(),
                subscription.customer.id
            )
        );
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
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
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
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }

    /**
     * Getter recipesRatingRepository
     * @return {IRateRepository}
     */
    public get recipesRatingRepository(): IRateRepository {
        return this._recipesRatingRepository;
    }
}
