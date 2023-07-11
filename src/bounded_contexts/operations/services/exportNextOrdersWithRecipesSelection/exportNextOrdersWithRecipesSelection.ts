import _ from "lodash";
import { stringify } from "querystring";
import { IExportService, OrdersWithRecipeSelectionExport, RecipeSelectionState } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Locale } from "../../domain/locale/Locale";
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

    // Agregar columna con cantidad de entregas hasta la fecha. N payment orders billed de una semana cuentan como 1 entrega, con que haya solo 1 cuenta como entrega,
    // Obtener todas las payment orders del customer hasta la fecha mas alta que se ingrese como filtro (El filtro tendrá semanas)
    // Por cada semana, sumar 1 en cada semana que tenga al menos 1 payment order billed

    public async execute(dto: ExportNextOrdersWithRecipesSelectionDto): Promise<void> {
        const weeksIds: WeekId[] = dto.weeks.map((id: string) => new WeekId(id));
        const orders: Order[] =
            weeksIds.length > 0
                ? await this.orderRepository.findByWeekList(weeksIds, Locale.es)
                : dto.billingDates.length > 0
                    ? await this.orderRepository.findByBillingDates(dto.billingDates, Locale.es)
                    : dto.shippingDates.length > 0
                        ? await this.orderRepository.findByShippingDates(dto.shippingDates, Locale.es)
                        : dto.customers.length > 0
                            ? await this.orderRepository.findAllByCustomersIds(
                                dto.customers.map((id) => new CustomerId(id)),
                                Locale.es
                            )
                            : await this.orderRepository.findCurrentWeekOrders(Locale.es);
        const activeOrders: Order[] = orders.filter((order) => !order.isSkipped() && !order.isCancelled());
        const paymentOrderOrderMap: { [paymentOrderId: string]: Order[] } = {};
        const subscriptionsIds: SubscriptionId[] = [];
        const paymentOrdersIds: PaymentOrderId[] = [];

        for (let order of activeOrders) {
            const actualPoId: string = (order.paymentOrderId?.value as string) || "SIN_PAGO_ASOCIADO";
            if (!!!order.paymentOrderId) console.log(`The order ${order.id.value} does not have a payment order`);
            subscriptionsIds.push(order.subscriptionId);
            paymentOrdersIds.push(order.paymentOrderId!);

            paymentOrderOrderMap[actualPoId] = Array.isArray(paymentOrderOrderMap[actualPoId])
                ? [...paymentOrderOrderMap[actualPoId], order]
                : [order];

            if (order.id.toString() === "ca788a20-471d-4b30-b985-1c9453544c8f") {
                console.log("The order exists");
                console.log("Paymnet order map: ", paymentOrderOrderMap[actualPoId]);
            }
        }

        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(subscriptionsIds);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findAll(Locale.es);
        // const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(paymentOrdersIds);
        // const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const subscriptionMap: { [subscriptionId: string]: Subscription } = {};
        const customerOrdersMap: { [customerId: string]: Order[] } = {};
        const paymentOrderMap: { [paymentOrderId: string]: PaymentOrder } = {};
        const paymentOrderExportLinesQuantityMap: { [paymentOrderId: string]: number } = {};
        const customerSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        var ordersExport: OrdersWithRecipeSelectionExport[] = [];

        for (let subscription of subscriptions) {
            const customerId: string = subscription.customer.id.toString();
            var customerSubscriptions = customerSubscriptionsMap[customerId];

            if (!!!customerSubscriptions) {
                customerSubscriptions = [subscription];
                customerSubscriptionsMap[customerId] = customerSubscriptions;
            }
            if (Array.isArray(customerSubscriptions)) customerSubscriptions = [...customerSubscriptions, subscription];

            subscriptionMap[subscription.id.value] = subscription;
        }

        const customerDeliveriesByWeek: { [customerId: string]: { [weekId: string]: number } } = {};
        const customerIterationCounter: { [customerId: string]: number } = {};

        for (let paymentOrder of paymentOrders) {
            const actualPoId: string = paymentOrder.id.value as string;
            const customerId: string = paymentOrder.customerId.value.toString();
            var customerBillingDateMap = customerDeliveriesByWeek[customerId];
            const paymentOrderWeekId = paymentOrder.week.id.value.toString();

            paymentOrderMap[actualPoId] = paymentOrder;

            if (!!paymentOrderOrderMap[actualPoId]) {
                paymentOrderExportLinesQuantityMap[actualPoId] = paymentOrderOrderMap[actualPoId].reduce(
                    (acc, order) => acc + (order.getNumberOfRecipesOrReturn0() === 0 ? 1 : order.getNumberOfRecipesOrReturn0()),
                    paymentOrder.shippingCost === 0 || paymentOrder.hasFreeShipping ? 0 : 1 // +1 because of the shipping line
                );
            }

            if (!!!customerBillingDateMap) customerBillingDateMap = {};

            if (paymentOrder.isBilled() && !!!customerBillingDateMap[paymentOrderWeekId]) {
                customerIterationCounter[customerId] = (customerIterationCounter[customerId] || 0) + 1;
                customerBillingDateMap[paymentOrderWeekId] = customerIterationCounter[customerId];
                customerDeliveriesByWeek[customerId] = customerBillingDateMap;
            }

        }

        for (let order of activeOrders) {
            const subscription = subscriptionMap[order.subscriptionId.value];
            const orderPlanVariant = order.plan.getPlanVariantById(order.planVariantId);

            if (order.recipeSelection.length === 0) {
                for (let i = 0; i < (order.getNumberOfRecipesOrReturn0() || 1); i++) {
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
                        paymentOrderNumber: paymentOrderMap[order.paymentOrderId!.value].humanId || "",
                        orderId: order.id.value,
                        orderState: order.state.title,
                        weekLabel: order.week.getShorterLabel(),
                        billingDate: order.getDdMmYyyyBillingDate(),
                        deliveryDate: order.getDdMmYyyyShipmentDate(),
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
                        planVariantId: order.planVariantId.value,
                        planVariantSku: orderPlanVariant?.sku.code || "",
                        planVariantDescription: orderPlanVariant?.getLabel() ?? "",
                        subscriptionRestrictionComment: subscription.restrictionComment,
                        subscriptionRestriction: RestrictionCodeFactory.createCode(subscription.restriction?.value),
                        recipeVariantSku: "",
                        recipeVariantId: "",
                        recipeName: "",
                        recipeSku: "",
                        //@ts-ignore
                        numberOfPersons: orderPlanVariant?.numberOfPersons || "",
                        //@ts-ignore
                        numberOfRecipes: orderPlanVariant?.numberOfRecipes || "",
                        customerPreferredLanguage: subscription.customer.getPersonalInfo().preferredLanguage!,
                        chooseState: order.plan.abilityToChooseRecipes ? RecipeSelectionState.AUN_NO_ELIGIO : RecipeSelectionState.NO_ELIGE,
                        pricePlan: order.getTotalPrice(),
                        kitPrice: order.getKitPrice(),
                        coupon: order.couponCode,
                        planDiscount: order.discountAmount,
                        kitDiscount: order.getKitDiscount(),
                        finalPrice: order.getTotalPrice() - order.discountAmount,
                        finalKitPrice: order.getFinalKitPrice(),
                        finalPortionPrice: order.getFinalPortionPrice(),
                        recipeDivision: 1 / paymentOrderExportLinesQuantityMap[order.paymentOrderId?.value!],
                        recivedOrdersQuantity: order.customer.receivedOrdersQuantity,
                        deliveriesUntilWeek: customerDeliveriesByWeek[order.customer.id.toString()]
                            ? customerDeliveriesByWeek[order.customer.id.toString()][order.week.id.value.toString()]
                            : 0,
                        onlyFirstWeek: !!(
                            customerDeliveriesByWeek[order.customer.id.toString()] &&
                            Object.entries(customerDeliveriesByWeek[order.customer.id.toString()]).length === 1 &&
                            customerSubscriptionsMap[order.customer.id.toString()].every((sub) => !sub.isActive())
                        ),
                    });
                }
            }

            for (let recipeSelection of order.recipeSelection) {
                for (let i = 0; i < recipeSelection.quantity; i++) {
                    ordersExport.push({
                        stripePaymentId:
                            order.paymentOrderId && paymentOrderMap[order.paymentOrderId.value]
                                ? paymentOrderMap[order.paymentOrderId.value].paymentIntentId || ""
                                : "",
                        paymentOrderId: order.paymentOrderId?.value || "",
                        paymentOrderState:
                            order.paymentOrderId && paymentOrderMap[order.paymentOrderId.value]
                                ? paymentOrderMap[order.paymentOrderId.value].state.title || ""
                                : "",
                        orderId: order.id.value,
                        paymentOrderNumber: paymentOrderMap[order.paymentOrderId!.value].humanId || "",
                        orderState: order.state.title,
                        weekLabel: order.week.getShorterLabel(),
                        billingDate: order.getDdMmYyyyBillingDate(),
                        deliveryDate: order.getDdMmYyyyShipmentDate(),
                        customerPreferredShippingHour: subscription.customer.getShippingAddress().preferredShippingHour,
                        customerId: subscription.customer.id.value,
                        customerFirstName: subscription.customer.getPersonalInfo()?.name!,
                        customerLastName: subscription.customer.getPersonalInfo()?.lastName!,
                        customerEmail: subscription.customer.email,
                        subscriptionDate: subscription.createdAt,
                        recipeFormSubmissionDate: order.firstDateOfRecipesSelection || "",
                        recipeFormUpdateDate: order.lastDateOfRecipesSelection || "",
                        planId: order.plan.id.value,
                        planSku: order.plan.planSku.code,
                        planName: order.plan.name,
                        planVariantId: order.planVariantId.toString(),
                        planVariantSku: orderPlanVariant?.sku.code || "",
                        planVariantDescription: orderPlanVariant?.getLabel() ?? "",
                        subscriptionRestrictionComment: subscription.restrictionComment,
                        subscriptionRestriction: RestrictionCodeFactory.createCode(subscription.restriction?.value),
                        recipeVariantSku:
                            recipeSelection.recipe.recipeVariants.find((variant) => variant.restriction.equals(subscription.restriction))
                                ?.sku.code || recipeSelection.recipe.getDefaultVariantSku(),
                        recipeVariantId: recipeSelection.recipeVariantId.value,
                        recipeName: recipeSelection.recipe.getName(),
                        recipeSku: recipeSelection.recipe.recipeGeneralData.recipeSku.code,
                        //@ts-ignore
                        numberOfPersons: orderPlanVariant?.numberOfPersons || "",
                        //@ts-ignore
                        numberOfRecipes: orderPlanVariant?.numberOfRecipes || "",
                        customerPreferredLanguage: subscription.customer.getPersonalInfo().preferredLanguage!,
                        chooseState: order.choseByAdmin ? RecipeSelectionState.ELEGIDA_POR_LC : RecipeSelectionState.ELIGIO, // TO DO: Elegido por LC
                        pricePlan: order.getTotalPrice(),
                        kitPrice: order.getKitPrice(),
                        coupon: order.couponCode,
                        planDiscount: order.discountAmount,
                        kitDiscount: order.getKitDiscount(),
                        finalKitPrice: order.getFinalKitPrice(),
                        finalPrice: order.getTotalPrice() - order.discountAmount,
                        finalPortionPrice: order.getFinalPortionPrice(),
                        recipeDivision: 1 / paymentOrderExportLinesQuantityMap[order.paymentOrderId?.value!],
                        recivedOrdersQuantity: order.customer.receivedOrdersQuantity,
                        deliveriesUntilWeek: customerDeliveriesByWeek[order.customer.id.toString()]
                            ? customerDeliveriesByWeek[order.customer.id.toString()][order.week.id.value.toString()]
                            : 0,
                        onlyFirstWeek: !!(
                            customerDeliveriesByWeek[order.customer.id.toString()] &&
                            Object.entries(customerDeliveriesByWeek[order.customer.id.toString()]).length === 1 &&
                            customerSubscriptionsMap[order.customer.id.toString()].every((sub) => !sub.isActive())
                        ),
                    });
                }
            }

            const customerIdOfActualOrder: CustomerId = subscriptionMap[order.subscriptionId.value].customer.id;
            customerOrdersMap[customerIdOfActualOrder.value] = Array.isArray(customerOrdersMap[customerIdOfActualOrder.value])
                ? [...customerOrdersMap[customerIdOfActualOrder.value], order]
                : [order];
        }

        ordersExport = _.orderBy(ordersExport, ["creationDate"], "desc");

        for (let paymentOrder of paymentOrders) {
            if (!!!paymentOrderOrderMap[paymentOrder.id.value.toString()]) continue;
            if (paymentOrder.shippingCost === 0 || paymentOrder.hasFreeShipping) continue;

            const auxOrder: Order | undefined = !!customerOrdersMap[paymentOrder.customerId.value]
                ? customerOrdersMap[paymentOrder.customerId.value][0]
                : undefined;
            ordersExport.push({
                stripePaymentId: paymentOrder.paymentIntentId,
                paymentOrderId: paymentOrder.id.value,
                paymentOrderState: paymentOrder.state.title,
                orderId: "N/A",
                paymentOrderNumber: paymentOrder.humanId?.toString() ?? "",
                orderState: "N/A",
                weekLabel: paymentOrder.week.getShorterLabel(),
                billingDate: auxOrder?.getDdMmYyyyBillingDate() ?? "",
                deliveryDate: auxOrder?.getDdMmYyyyShipmentDate() ?? "",
                customerPreferredShippingHour: auxOrder?.customer.getShippingAddress().preferredShippingHour || "",
                customerId: paymentOrder.customerId.value,
                customerFirstName: auxOrder?.customer.getPersonalInfo().name! || "",
                customerLastName: auxOrder?.customer.getPersonalInfo().lastName! || "",
                customerEmail: auxOrder?.customer.email || "",
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
                customerPreferredLanguage: auxOrder?.customer.getPersonalInfo().preferredLanguage! || "",
                chooseState: "N/A", // TO DO: Elegido por LC
                pricePlan: paymentOrder.shippingCost,
                kitPrice: paymentOrder.shippingCost / 1,
                coupon: "",
                planDiscount: 0,
                kitDiscount: 0 / 1,
                finalPrice: paymentOrder.shippingCost,
                finalKitPrice: paymentOrder.shippingCost,
                finalPortionPrice: 0,
                recipeDivision: 1 / paymentOrderExportLinesQuantityMap[paymentOrder.id.value as string],
                recivedOrdersQuantity: !!auxOrder && !!auxOrder?.customer ? auxOrder?.customer.receivedOrdersQuantity : 0,
                deliveriesUntilWeek: 0,
                onlyFirstWeek:
                    !!auxOrder && !!auxOrder?.customer && customerDeliveriesByWeek[auxOrder.customer.id.toString()]
                        ? Object.entries(customerDeliveriesByWeek[auxOrder.customer.id.toString()]).length === 1 &&
                        customerSubscriptionsMap[auxOrder.customer.id.toString()].every((sub) => !sub.isActive())
                        : false,
            });
        }

        const sortedExport = _.orderBy(ordersExport, ["customerEmail"], "asc");
        this.exportService.exportNextOrdersWithRecipesSelection(sortedExport);

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
