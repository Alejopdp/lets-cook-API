import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { ExportCancellationsDto } from "./exportCancellationsDto";
import { CancellationExport, IExportService } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";

export class ExportCancellations {
    private _subscriptionRepository: ISubscriptionRepository;
    private _exportService: IExportService;

    constructor(subscriptionRepository: ISubscriptionRepository, exportService: IExportService) {
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
    }
    public async execute(dto: ExportCancellationsDto): Promise<any> {
        const cancelledSubscriptions: Subscription[] = await this.subscriptionRepository.findAllCancelledSubscriptions();
        const exportRows: CancellationExport[] = [];

        for (let subscription of cancelledSubscriptions) {
            exportRows.push({
                customerId: subscription.customer.id.value,
                customerEmail: subscription.customer.email,
                customerFirstName: subscription.customer.getPersonalInfo().name!,
                customerLastName: subscription.customer.getPersonalInfo().lastName!,
                subscriptionId: subscription.id.value,
                status: subscription.state.humanTitle,
                subscriptionCreatedAt: MomentTimeService.getDddDdMmmm(subscription.createdAt),
                planTitle: subscription.plan.name,
                planVariantTitle: subscription.getPlanVariantLabel(),
                cancellationReason: subscription.cancellationReason?.title || "",
                cancellationDate: !!subscription.cancellationReason
                    ? MomentTimeService.getDddDdMmmm(subscription.cancellationReason?.date!)
                    : "",
                cancellationComment: "",
                // numberOfActiveSubscriptions: 999,
                // numberOfSubscriptions: 1,
                // pastOrdersCount: 0,
                // shopifyCustomerId: "",
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
}
