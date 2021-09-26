import _ from "lodash";
import { IExportService, OrdersWithRecipeSelectionExport, RecipeSelectionState } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { RestrictionCodeFactory } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RestrictionCodeFactory";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { WeekId } from "../../domain/week/WeekId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { ExportNextOrdersWithRecipesSelectionDto } from "./exportNextOrdersWithRecipesSelectionDto";

export class ExportNextOrdersWithRecipesSelection {
    private _orderRepository: IOrderRepository;
    private _weekRepository: IWeekRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _exportService: IExportService;
    private _shippingZoneRepository: IShippingZoneRepository;

    constructor(
        orderRepository: IOrderRepository,
        weekRepository: IWeekRepository,
        subscriptionRepository: ISubscriptionRepository,
        exportService: IExportService,
        shippingZoneRepository: IShippingZoneRepository
    ) {
        this._orderRepository = orderRepository;
        this._weekRepository = weekRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
        this._shippingZoneRepository = shippingZoneRepository;
    }

    public async execute(dto: ExportNextOrdersWithRecipesSelectionDto): Promise<void> {
        const weeksIds: WeekId[] = dto.weeks.map((id: string) => new WeekId(id));
        const orders: Order[] =
            weeksIds.length > 0
                ? await this.orderRepository.findByWeekList(weeksIds)
                : dto.billingDates.length > 0
                ? await this.orderRepository.findByBillingDates(dto.billingDates)
                : dto.shippingDates.length > 0
                ? await this.orderRepository.findByShippingDates(dto.shippingDates)
                : dto.customers.length > 0
                ? await this.orderRepository.findAllByCustomersIds(dto.customers.map((id) => new CustomerId(id)))
                : await this.orderRepository.findCurrentWeekOrders();

        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(orders.map((order) => order.subscriptionId));
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const subscriptionMap: { [subscriptionId: string]: Subscription } = {};
        const customerOrdersMap: { [customerId: string]: Order[] } = {};
        var ordersExport: OrdersWithRecipeSelectionExport[] = [];

        for (let subscription of subscriptions) {
            subscriptionMap[subscription.id.value] = subscription;
        }

        for (let order of orders) {
            const subscription = subscriptionMap[order.subscriptionId.value];
            const orderPlanVariant = order.plan.getPlanVariantById(order.planVariantId);

            if (order.recipeSelection.length === 0) {
                ordersExport.push({
                    orderId: order.id.value,
                    weekLabel: order.week.getShorterLabel(),
                    deliveryDate: MomentTimeService.getDddDdMmmm(order.shippingDate),
                    customerPreferredShippingHour: subscription.customer.getShippingAddress().preferredShippingHour,
                    customerId: subscription.customer.id.value,
                    customerFirstName: subscription.customer.getPersonalInfo().name!,
                    customerLastName: subscription.customer.getPersonalInfo().lastName!,
                    customerEmail: subscription.customer.email,
                    subscriptionDate: subscription.createdAt,
                    recipeFormSubmissionDate: order.firstDateOfRecipesSelection || "",
                    recipeFormUpdateDate: order.lastDateOfRecipesSelection || "",
                    planId: order.plan.id.value,
                    planSku: order.plan.planSku.code,
                    planName: order.plan.name,
                    planVariantId: subscription.planVariantId.value,
                    planVariantSku: subscription.plan.getPlanVariantById(subscription.planVariantId)?.sku.code || "",
                    planVariantDescription: subscription.getPlanVariantLabel(),
                    subscriptionRestrictionComment: subscription.restrictionComment,
                    subscriptionRestriction: RestrictionCodeFactory.createCode(subscription.restriction?.value),
                    recipeVariantSku: "",
                    recipeVariantId: "",
                    recipeName: "",
                    //@ts-ignore
                    numberOfPersons: subscription.plan.getPlanVariantById(subscription.planVariantId)?.numberOfPersons || "",
                    //@ts-ignore
                    numberOfRecipes: subscription.plan.getPlanVariantById(subscription.planVariantId)?.numberOfRecipes || "",
                    customerPreferredLanguage: subscription.customer.getPersonalInfo().preferredLanguage!,
                    chooseState: order.plan.abilityToChooseRecipes ? RecipeSelectionState.AUN_NO_ELIGIO : RecipeSelectionState.NO_ELIGE,
                    pricePlan: order.getTotalPrice(),
                    kitPrice: order.getKitPrice(),
                    planDiscount: order.discountAmount,
                    kitDiscount: order.getKitDiscount(),
                    finalPrice: order.getTotalPrice() - order.discountAmount,
                    finalKitPrice: order.getFinalKitPrice(),
                    finalPortionPrice: order.getFinalPortionPrice(),
                });
            }

            for (let recipeSelection of order.recipeSelection) {
                for (let i = 0; i < recipeSelection.quantity; i++) {
                    ordersExport.push({
                        orderId: order.id.value,
                        weekLabel: order.week.getShorterLabel(),
                        deliveryDate: MomentTimeService.getDddDdMmmm(order.shippingDate),
                        customerPreferredShippingHour: subscription.customer.getShippingAddress().preferredShippingHour,
                        customerId: subscription.customer.id.value,
                        customerFirstName: subscription.customer.getPersonalInfo().name!,
                        customerLastName: subscription.customer.getPersonalInfo().lastName!,
                        customerEmail: subscription.customer.email,
                        subscriptionDate: subscription.createdAt,
                        recipeFormSubmissionDate: order.firstDateOfRecipesSelection || "",
                        recipeFormUpdateDate: order.lastDateOfRecipesSelection || "",
                        planId: order.plan.id.value,
                        planSku: order.plan.planSku.code,
                        planName: order.plan.name,
                        planVariantId: subscription.planVariantId.value,
                        planVariantSku: subscription.plan.getPlanVariantById(subscription.planVariantId)?.sku.code || "",
                        planVariantDescription: subscription.getPlanVariantLabel(),
                        subscriptionRestrictionComment: subscription.restrictionComment,
                        subscriptionRestriction: RestrictionCodeFactory.createCode(subscription.restriction?.value),
                        recipeVariantSku:
                            recipeSelection.recipe.recipeVariants.find((variant) => variant.restriction.equals(subscription.restriction))
                                ?.sku.code || "",
                        recipeVariantId: recipeSelection.recipeVariantId.value,
                        recipeName: recipeSelection.recipe.getName(),
                        //@ts-ignore
                        numberOfPersons: subscription.plan.getPlanVariantById(subscription.planVariantId)?.numberOfPersons || "",
                        //@ts-ignore
                        numberOfRecipes: subscription.plan.getPlanVariantById(subscription.planVariantId)?.numberOfRecipes || "",
                        customerPreferredLanguage: subscription.customer.getPersonalInfo().preferredLanguage!,
                        chooseState: order.choseByAdmin ? RecipeSelectionState.ELEGIDA_POR_LC : RecipeSelectionState.ELIGIO, // TO DO: Elegido por LC
                        pricePlan: order.getTotalPrice(),
                        kitPrice: order.getKitPrice(),
                        planDiscount: order.discountAmount,
                        kitDiscount: order.getKitDiscount(),
                        finalPrice: order.getTotalPrice() - order.discountAmount,
                        finalKitPrice: order.getFinalKitPrice(),
                        finalPortionPrice: order.getFinalPortionPrice(),
                    });
                }
            }

            const customerIdOfActualOrder: CustomerId = subscriptionMap[order.subscriptionId.value].customer.id;
            customerOrdersMap[customerIdOfActualOrder.value] = Array.isArray(customerOrdersMap[customerIdOfActualOrder.value])
                ? [...customerOrdersMap[customerIdOfActualOrder.value], order]
                : [order];
        }

        ordersExport = _.orderBy(ordersExport, ["creationDate"], "desc");

        for (let customerId in customerOrdersMap) {
            const customerOrders = customerOrdersMap[customerId];
            const customer: Customer = subscriptionMap[customerOrders[0].subscriptionId.value].customer;

            if (customerOrders.every((order) => !order.hasFreeShipping)) {
                const customerShippingZone: ShippingZone = shippingZones.find((zone) =>
                    zone.hasAddressInside(customer.shippingAddress?.latitude!, customer.shippingAddress?.longitude!)
                )!;

                ordersExport.push({
                    orderId: "",
                    weekLabel: customerOrders[0].week.getShorterLabel(),
                    deliveryDate: MomentTimeService.getDddDdMmmm(customerOrders[0].shippingDate),
                    customerPreferredShippingHour: customer.getShippingAddress().preferredShippingHour,
                    customerId: customerId,
                    customerFirstName: customer.getPersonalInfo().name!,
                    customerLastName: customer.getPersonalInfo().lastName!,
                    customerEmail: customer.email,
                    subscriptionDate: "",
                    recipeFormSubmissionDate: "",
                    recipeFormUpdateDate: "",
                    planId: "",
                    planSku: "",
                    planName: "",
                    planVariantId: "",
                    planVariantSku: "",
                    planVariantDescription: "",
                    subscriptionRestrictionComment: "",
                    subscriptionRestriction: "",
                    recipeVariantSku: "",
                    recipeVariantId: "",
                    recipeName: "",
                    numberOfPersons: 0,
                    numberOfRecipes: 0,
                    customerPreferredLanguage: customer.getPersonalInfo().preferredLanguage!,
                    chooseState: "", // TO DO: Elegido por LC
                    pricePlan: customerShippingZone.cost,
                    kitPrice: customerShippingZone.cost,
                    planDiscount: customerShippingZone.cost,
                    kitDiscount: customerShippingZone.cost,
                    finalPrice: customerShippingZone.cost,
                    finalKitPrice: customerShippingZone.cost,
                    finalPortionPrice: customerShippingZone.cost,
                });
            }
        }

        // const sortedExport = _.orderBy(ordersExport, [""]);
        this.exportService.exportNextOrdersWithRecipesSelection(ordersExport);

        return;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */

    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */

    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter exportService
     * @return {IExportService}
     */
    public get exportService(): IExportService {
        return this._exportService;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }
}
