import { IExportService, OrdersWithRecipeSelectionExport } from "../../application/exportService/IExportService";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";

export class ExportNextOrdersWithRecipesSelection {
    private _orderRepository: IOrderRepository;
    private _weekRepository: IWeekRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _exportService: IExportService;

    constructor(
        orderRepository: IOrderRepository,
        weekRepository: IWeekRepository,
        subscriptionRepository: ISubscriptionRepository,
        exportService: IExportService
    ) {
        this._orderRepository = orderRepository;
        this._weekRepository = weekRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
    }

    public async execute(): Promise<void> {
        const date = new Date();
        if (date.getDay() === 5 || date.getDay() === 6) date.setDate(date.getDate() + 7);

        const actualWeek: Week | undefined = await this.weekRepository.findCurrentWeek(date);
        if (!!!actualWeek) throw new Error("Está queriendo exportar ordenes de una semana no registrada en la base de datos");
        const orders: Order[] = await this.orderRepository.findByWeek(actualWeek.id);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(orders.map((order) => order.subscriptionId));
        const subscriptionMap: { [subscriptionId: string]: Subscription } = {};
        const ordersExport: OrdersWithRecipeSelectionExport[] = [];

        for (let subscription of subscriptions) {
            subscriptionMap[subscription.id.value] = subscription;
        }

        for (let order of orders) {
            const subscription = subscriptionMap[order.subscriptionId.value];
            for (let recipeSelection of order.recipeSelection) {
                ordersExport.push({
                    orderId: order.id.value,
                    weekLabel: actualWeek.getLabel(),
                    deliveryDate: order.getHumanShippmentDay(),
                    customerPreferredShippingHour: subscription.customer.getShippingAddress().preferredShippingHour,
                    customerId: subscription.customer.id.value,
                    customerFirstName: subscription.customer.getPersonalInfo().name!,
                    customerLastName: subscription.customer.getPersonalInfo().lastName!,
                    customerEmail: subscription.customer.email,
                    recipeFormSubmissionDate: "???",
                    recipeFormUpdateDate: "???",
                    planId: order.plan.id.value,
                    planSku: order.plan.planSku.code,
                    planName: order.plan.name,
                    planVariantId: subscription.planVariantId.value,
                    planVariantSku: subscription.getPlanVariantSku()?.code || "",
                    planVariantDescription: subscription.getPlanVariantLabel(),
                    recipeVariantSku:
                        recipeSelection.recipe.recipeVariants.find((variant) => variant.restriction.equals(subscription.restriction))?.sku
                            .code || "",
                    recipeVariantId: recipeSelection.recipeVariantId.value,
                    recipeName: `${recipeSelection.quantity} x ${recipeSelection.recipe.getName()}`,
                    numberOfPersons: subscription.plan.getPlanVariantById(subscription.planVariantId)?.numberOfPersons || "",
                    numberOfRecipes: subscription.plan.getPlanVariantById(subscription.planVariantId)?.numberOfRecipes || "",
                    customerPreferredLanguage: subscription.customer.getPersonalInfo().preferredLanguage!,
                });
            }
        }

        this.exportService.exportNextOrdersWithRecipesSelection(ordersExport);
        console.log("a");

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
}
