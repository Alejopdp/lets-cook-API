import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { ExportCancellationsDto } from "./exportCancellationsDto";
import { CancellationExport, IExportService } from "../../application/exportService/IExportService";
import { Locale } from "../../domain/locale/Locale";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { Order } from "../../domain/order/Order";

export class ExportCancellations {
    private _subscriptionRepository: ISubscriptionRepository;
    private _exportService: IExportService;
    private _orderRepository: IOrderRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, exportService: IExportService, orderRepository: IOrderRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
        this._orderRepository = orderRepository;
    }
    public async execute(dto: ExportCancellationsDto): Promise<any> {
        const [subscriptions, cancelledSubscriptions]: [Subscription[], Subscription[]] = await Promise.all([
            this.subscriptionRepository.findAll(Locale.es),
            this.subscriptionRepository.findAllCancelledSubscriptions(),
        ]);
        const ordersOfCancelledSubcriptions: Order[] = await this.orderRepository.findPastOrdersBySubscriptionIdList(
            cancelledSubscriptions.map((sub) => sub.id),
            Locale.es
        );
        const subscriptionOrdersMap: { [subscriptionId: string]: Order[] } = {};
        const exportRows: CancellationExport[] = [];
        const customerActiveSubscriptionsMap: { [customerId: string]: Subscription[] } = {};

        for (let subscription of subscriptions) {
            const actualKey = subscription.customer.id.toString();

            customerActiveSubscriptionsMap[actualKey] =
                Array.isArray(customerActiveSubscriptionsMap[actualKey]) && subscription.state.isActive()
                    ? [...customerActiveSubscriptionsMap[actualKey], subscription]
                    : subscription.state.isActive()
                    ? [subscription]
                    : customerActiveSubscriptionsMap[actualKey] || [];
        }

        for (let order of ordersOfCancelledSubcriptions) {
            if (!Array.isArray(subscriptionOrdersMap[order.subscriptionId.toString()]))
                subscriptionOrdersMap[order.subscriptionId.toString()] = [];
            if (!order.isBilled()) continue;

            [...subscriptionOrdersMap[order.subscriptionId.toString()], order];
        }

        for (let subscription of cancelledSubscriptions) {
            exportRows.push({
                customerId: subscription.customer.id.value,
                customerEmail: subscription.customer.email,
                customerFirstName: subscription.customer.getPersonalInfo().name!,
                customerLastName: subscription.customer.getPersonalInfo().lastName!,
                subscriptionId: subscription.id.value,
                status: subscription.getStateHumanTitle(Locale.es),
                subscriptionCreatedAt: subscription.createdAt,
                planTitle: subscription.plan.name,
                planVariantTitle: subscription.getPlanVariantLabel(Locale.es),
                cancellationReason: subscription.cancellationReason?.title || "",
                cancellationDate: !!subscription.cancellationReason ? subscription.cancellationReason?.date! : "",
                cancellationComment: subscription.cancellationReason?.comment ?? "",
                User_or_admin: subscription.cancellationReason?.cancelledBy ?? "",
                customerPhoneNumber1: subscription.customer.getPersonalInfo().phone1 ?? "",
                customerPhoneNumber2: subscription.customer.getPersonalInfo().phone2 ?? "",
                weeksQTY: subscriptionOrdersMap[subscription.id.toString()]?.length ?? 0,
                active_subscriptions: customerActiveSubscriptionsMap[subscription.customer.id.value]?.length || 0,
            });
        }

        this.exportService.exportCancellations(exportRows);
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
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
