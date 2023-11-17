import { IStorageService } from "../../application/storageService/IStorageService";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Plan } from "../../domain/plan/Plan";
import { PlanFrequencyFactory, PlanFrequencyType } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanSku } from "../../domain/plan/PlanSku";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { Subscription } from "../../domain/subscription/Subscription";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { UpdatePlanDto } from "./updatePlanDto";

type planVariantPricesMap = {
    [planVariantId: string]: { oldPrice: number; newPrice: number; oldPriceWithOffer?: number; newPriceWithOffer?: number };
};
export class UpdatePlan {
    private _planRepository: IPlanRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _storageService: IStorageService;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(
        planRepository: IPlanRepository,
        subscriptionRepository: ISubscriptionRepository,
        storageService: IStorageService,
        orderRepository: IOrderRepository,
        paymentOrderRepositoy: IPaymentOrderRepository
    ) {
        this._planRepository = planRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._storageService = storageService;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepositoy;
    }

    public async execute(dto: UpdatePlanDto): Promise<void> {
        const plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.id), dto.locale);
        if (!plan) throw new Error("El plan ingresado no existe");
        const planVariantsMap: { [planVariantId: string]: PlanVariant } = {};
        const planVariantsWithUpdatedPriceMap: planVariantPricesMap = {};
        const additionalPlans: Plan[] =
            dto.additionalPlansIds.length > 0
                ? await this.planRepository.findAdditionalPlanListById(
                    //@ts-ignore
                    dto.additionalPlansIds.map((id: string | number) => new PlanId(id)),
                    dto.locale
                )
                : [];

        const planSku: PlanSku = new PlanSku(dto.planSku);
        const planVariants: PlanVariant[] = [];
        var isThereAPriceUpdate: boolean = false;

        this.populatePlanVariantsMap(plan.planVariants, planVariantsMap);

        for (let variant of dto.planVariants) {
            var attributes: PlanVariantAttribute[] = [];
            if (variant.id === variant.auxId) {
                variant.id = "";
            }

            attributes = Object.entries(variant).map((entry) => new PlanVariantAttribute(entry[0], entry[1] as string));

            attributes = attributes.filter(
                (attr) =>
                    attr.key.toLowerCase() !== "personas" &&
                    attr.key.toLowerCase() !== "recetas" &&
                    attr.key.toLowerCase() !== "id" &&
                    attr.key.toLowerCase() !== "sku" &&
                    attr.key.toLowerCase() !== "price" &&
                    attr.key.toLowerCase() !== "pricewithoffer" &&
                    attr.key.toLowerCase() !== "isdefault" &&
                    attr.key.toLowerCase() !== "isdeleted" &&
                    attr.key.toLowerCase() !== "deleted" &&
                    attr.key.toLowerCase() !== "description" &&
                    attr.key.toLowerCase() !== "attributes" &&
                    attr.key.toLowerCase() !== "auxid" &&
                    attr.key.toLowerCase() !== "oldid"
            );

            let planVariant: PlanVariant = new PlanVariant(
                new PlanSku(variant.sku),
                "",
                variant.price,
                attributes,
                variant.description,
                variant.isDefault,
                variant.isDeleted,
                variant.priceWithOffer,
                new PlanVariantId(variant.id),
                variant.Personas,
                variant.Recetas
            );

            const planVariantBeingUpdated = planVariantsMap[planVariant.id.toString()];
            const hasAPriceUpdate =
                !!planVariantBeingUpdated &&
                (planVariantBeingUpdated.price !== planVariant.price ||
                    planVariantBeingUpdated.priceWithOffer !== planVariant.priceWithOffer);

            if (hasAPriceUpdate) {
                isThereAPriceUpdate = true;
                planVariantsWithUpdatedPriceMap[planVariantBeingUpdated.id.toString()] = {
                    newPrice: planVariant.price,
                    newPriceWithOffer: planVariant.priceWithOffer,
                    oldPrice: planVariantBeingUpdated.price,
                    oldPriceWithOffer: planVariantBeingUpdated.priceWithOffer,
                };
            }
            planVariants.push(planVariant);
        }

        if (planVariants.every((variant) => !variant.isDefault))
            throw new Error("Es necesario indicar por lo menos una variante como default");
        if (planVariants.some((variatn) => variatn.isDefault && variatn.isDeleted))
            throw new Error("No es posible marcar como default una varianta marcada como eliminada");

        const planVariantsIds: PlanVariantId[] = planVariants.reduce(
            (acc: PlanVariantId[], planVariant) => (planVariant.isDeleted ? [...acc, planVariant.id] : acc),
            []
        );

        const subscriptionsWithOneOfThePlanVariants = await this.subscriptionRepository.findActiveSubscriptionByPlanVariantsIds(
            planVariantsIds
        );

        if (subscriptionsWithOneOfThePlanVariants.length > 0)
            throw new Error("No puedes borrar una variante que está relacionada a una suscripción activa");

        if (dto.planImage) {
            const imageUrl = await this.storageService.savePlanImage(dto.planName, dto.planImageFileName, dto.planImage);

            plan.imageUrl = imageUrl;
        }

        // if (dto.iconLinealFile) {
        //     const iconLinealUrl = await this.storageService.saveIconLineal(dto.planName, dto.planImageFileName, dto.iconLinealFile);

        //     plan.iconLinealUrl = iconLinealUrl;
        // }

        // if (dto.iconLinealColorFile) {
        //     const iconLinealColorUrl = await this.storageService.saveIconLinealColor(dto.planName, dto.iconLinealColorFileName, dto.iconLinealColorFile);

        //     plan.iconLinealColorUrl = iconLinealColorUrl;
        // }

        plan.availablePlanFrecuencies = dto.availablePlanFrecuencies.map((freq: PlanFrequencyType) => PlanFrequencyFactory.createPlanFrequency(freq));
        plan.description = dto.planDescription;
        plan.isActive = dto.isActive;
        plan.name = dto.planName;
        plan.planVariants = planVariants;
        plan.planSku = planSku;
        plan.updateAdditionalPlans(additionalPlans);
        plan.changeType(dto.planType);

        if (!dto.hasRecipes && dto.hasRecipes !== plan.hasRecipes) {
            plan.hasRecipes = dto.hasRecipes;
            // TO DO: Update Recipe relations
        } else {
            plan.hasRecipes = dto.hasRecipes;
        }

        await this.planRepository.save(plan);

        if (isThereAPriceUpdate) {
            const planVariantsWithNewPriceIds = Object.entries(planVariantsWithUpdatedPriceMap).map((entry) => new PlanVariantId(entry[0]));
            await this.updateOrdersAndPaymentOrdersPrice(planVariantsWithNewPriceIds, planVariantsWithUpdatedPriceMap);
        }
    }

    private populatePlanVariantsMap(variants: PlanVariant[], map: { [planVariantId: string]: PlanVariant }): void {
        for (let variant of variants) {
            map[variant.id.toString()] = variant;
        }
    }

    private async updateOrdersAndPaymentOrdersPrice(
        planVariantsWithNewPriceIds: PlanVariantId[],
        planVariantsPriceMap: planVariantPricesMap
    ): Promise<void> {
        const subscriptions = await this.subscriptionRepository.findActiveSubscriptionByPlanVariantsIds(planVariantsWithNewPriceIds);
        const orders = await this.orderRepository.findActiveBySubscriptionIdList(subscriptions.map((sub) => sub.id));
        const paymentOrders = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));
        const paymentOrderMap: { [paymentOrderId: string]: PaymentOrder } = {};

        for (let paymentOrder of paymentOrders) {
            paymentOrderMap[paymentOrder.id.toString()] = paymentOrder;
        }

        for (let order of orders) {
            const planVariant = planVariantsPriceMap[order.planVariantId.toString()];
            const newPrice = planVariant.newPriceWithOffer || planVariant.newPrice;
            const paymentOrder = paymentOrderMap[order.paymentOrderId!.toString()];

            paymentOrder.discountOrderAmount(order);
            order.price = newPrice;
            paymentOrder.addOrder(order);
        }

        await this.orderRepository.updateMany(orders);
        await this.paymentOrderRepository.updateMany(paymentOrders);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
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
}
