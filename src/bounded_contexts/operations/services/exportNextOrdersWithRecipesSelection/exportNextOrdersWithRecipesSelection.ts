import _ from "lodash";
import { IExportService, OrdersWithRecipeSelectionExport, RecipeSelectionState } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { RestrictionCodeFactory } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RestrictionCodeFactory";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { WeekId } from "../../domain/week/WeekId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
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
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(
        orderRepository: IOrderRepository,
        weekRepository: IWeekRepository,
        subscriptionRepository: ISubscriptionRepository,
        exportService: IExportService,
        shippingZoneRepository: IShippingZoneRepository,
        paymentOrderRepository: IPaymentOrderRepository
    ) {
        this._orderRepository = orderRepository;
        this._weekRepository = weekRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
        this._shippingZoneRepository = shippingZoneRepository;
        this._paymentOrderRepository = paymentOrderRepository;
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

        const subscriptionsIds: SubscriptionId[] = [];
        const paymentOrdersIds: PaymentOrderId[] = [];
        const customersQuantityOfRecipeSelectionMap: { [customerId: string]: number } = {};

        for (let order of orders) {
            if (!!!order.paymentOrderId) console.log(`The order ${order.id.value} does not have a payment order`);
            subscriptionsIds.push(order.subscriptionId);
            paymentOrdersIds.push(order.paymentOrderId!);
            customersQuantityOfRecipeSelectionMap[order.customer.id.value] =
                (customersQuantityOfRecipeSelectionMap[order.customer.id.value] || 0) + order.getNumberOfRecipesOrReturn0();
        }

        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(subscriptionsIds);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(paymentOrdersIds);
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const subscriptionMap: { [subscriptionId: string]: Subscription } = {};
        const customerOrdersMap: { [customerId: string]: Order[] } = {};
        const paymentOrderMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const customerSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        var ordersExport: OrdersWithRecipeSelectionExport[] = [];

        for (let subscription of subscriptions) {
            subscriptionMap[subscription.id.value] = subscription;
        }

        for (let paymentOrder of paymentOrders) {
            paymentOrderMap[paymentOrder.id.value] = paymentOrder;
        }

        for (let order of orders) {
            const subscription = subscriptionMap[order.subscriptionId.value];
            const orderPlanVariant = order.plan.getPlanVariantById(order.planVariantId);

            console.log("CUSTOMER: ", subscription.customer.id.value);
            if (order.recipeSelection.length === 0) {
                ordersExport.push({
                    stripePaymentId:
                        order.paymentOrderId && paymentOrderMap[order.paymentOrderId.value]
                            ? paymentOrderMap[order.paymentOrderId.value]?.paymentIntentId || ""
                            : "",
                    paymentOrderId: order.paymentOrderId?.value || "",
                    paymentOrderState:
                        order.paymentOrderId && paymentOrderMap[order.paymentOrderId.value]
                            ? paymentOrderMap[order.paymentOrderId.value]?.state.title || ""
                            : "",
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
                    recipeSku: "",
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
                    recipeDivision:
                        customersQuantityOfRecipeSelectionMap[order.customer.id.value] === 0
                            ? 0
                            : 1 / customersQuantityOfRecipeSelectionMap[order.customer.id.value],
                });
            }

            for (let recipeSelection of order.recipeSelection) {
                for (let i = 0; i < recipeSelection.quantity; i++) {
                    ordersExport.push({
                        stripePaymentId:
                            order.paymentOrderId && paymentOrderMap[order.paymentOrderId.value]
                                ? paymentOrderMap[order.paymentOrderId.value]?.paymentIntentId || ""
                                : "",
                        paymentOrderId: order.paymentOrderId?.value || "",
                        paymentOrderState:
                            order.paymentOrderId && paymentOrderMap[order.paymentOrderId.value]
                                ? paymentOrderMap[order.paymentOrderId.value]?.state.title || ""
                                : "",
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
                        recipeSku: recipeSelection.recipe.getDefaultVariantSku(),
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
                        recipeDivision:
                            customersQuantityOfRecipeSelectionMap[order.customer.id.value] === 0
                                ? 0
                                : 1 / customersQuantityOfRecipeSelectionMap[order.customer.id.value],
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
                    stripePaymentId: "N/A",
                    paymentOrderId: "N/A",
                    paymentOrderState: "N/A",
                    orderId: "N/A",
                    weekLabel: customerOrders[0].week.getShorterLabel(),
                    deliveryDate: MomentTimeService.getDddDdMmmm(customerOrders[0].shippingDate),
                    customerPreferredShippingHour: customer.getShippingAddress().preferredShippingHour,
                    customerId: customerId,
                    customerFirstName: customer.getPersonalInfo().name!,
                    customerLastName: customer.getPersonalInfo().lastName!,
                    customerEmail: customer.email,
                    subscriptionDate: "N/A",
                    recipeFormSubmissionDate: "N/A",
                    recipeFormUpdateDate: "N/A",
                    planId: "N/A",
                    planSku: "N/A",
                    planName: "Envío",
                    planVariantId: "N/A",
                    planVariantSku: "N/A",
                    planVariantDescription: "N/A",
                    subscriptionRestrictionComment: "N/A",
                    subscriptionRestriction: "N/A",
                    recipeVariantSku: "N/A",
                    recipeVariantId: "N/A",
                    recipeName: "N/A",
                    recipeSku: "",
                    numberOfPersons: 0,
                    numberOfRecipes: 0,
                    customerPreferredLanguage: customer.getPersonalInfo().preferredLanguage!,
                    chooseState: "N/A", // TO DO: Elegido por LC
                    pricePlan: customerShippingZone.cost,
                    kitPrice: 0,
                    planDiscount: 0,
                    kitDiscount: 0,
                    finalPrice: 0,
                    finalKitPrice: 0,
                    finalPortionPrice: 0,
                    recipeDivision: 0,
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

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
