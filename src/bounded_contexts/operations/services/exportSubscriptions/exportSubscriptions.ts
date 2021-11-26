import { IExportService, OrdersWithRecipeSelectionExport, SubscriptionExport } from "../../application/exportService/IExportService";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";

export class ExportSubscriptions {
    private _shippingZoneRepository: IShippingZoneRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _exportService: IExportService;

    constructor(
        shippingZoneRepository: IShippingZoneRepository,
        subscriptionRepository: ISubscriptionRepository,
        exportService: IExportService
    ) {
        this._shippingZoneRepository = shippingZoneRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._exportService = exportService;
    }

    public async execute(): Promise<void> {
        const subscriptions: Subscription[] = await this.subscriptionRepository.findAll(Locale.es);
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const subscriptionsExport: SubscriptionExport[] = [];

        for (let subscription of subscriptions) {
            const shippingZone: ShippingZone | undefined = shippingZones.find((zone) =>
                zone.hasAddressInside(
                    subscription.customer.getShippingAddress().latitude!,
                    subscription.customer.getShippingAddress().longitude!
                )
            );

            subscriptionsExport.push({
                customerId: subscription.customer.id.value,
                customerFirstName: subscription.customer.getPersonalInfo().name || "",
                customerLastName: subscription.customer.getPersonalInfo().name || "",
                customerEmail: subscription.customer.email,
                subscriptionId: subscription.id.value,
                subscriptionFrequency: subscription.frequency.getLabel(),
                subscriptionState: subscription.state.humanTitle,
                planId: subscription.plan.id.value,
                planSku: subscription.plan.planSku.code,
                planName: subscription.plan.name,
                planVariantId: subscription.planVariantId.value,
                planVariantSku: subscription.plan.getPlanVariantById(subscription.planVariantId)?.sku.code || "",
                planVariantDescription: subscription.getPlanVariantLabel(Locale.es),
                price: subscription.plan.getPlanVariantPrice(subscription.planVariantId),
                billingFirstName: subscription.customer.getBillingData().customerName || "",
                billingLastName: subscription.customer.billingAddress?.customerName || "",
                billingAddressName: subscription.customer.getBillingData().addressName || "",
                billingAddressDetails: subscription.customer.getBillingData().details || "",
                billingCity: "N/A",
                billingProvince: "N/A",
                billingZipCode: "N/A",
                billingCountry: "España",
                billingPhoneNumber: "N/A",
                shippingAddressName: subscription.customer.getShippingAddress().name || "",
                shippingAddressDetails: subscription.customer.getShippingAddress().details || "",
                shippingAddressCity: "N/A",
                shippingAddressProvince: "N/A",
                shippingAddressZipCode: "N/A",
                shippingCountry: "España",
                shippingUpdateDate: "???",
                discountCode: subscription.coupon?.couponCode || "",
                shippingZone: shippingZone?.name || "",
                shippingDay: shippingZone?.getDayLabel() || "",
                customerPreferredShippingHour: subscription.customer.getShippingAddress().preferredShippingHour,
                subscriptionRestriction: subscription.restriction?.label || "",
                subscriptionRestrictionComment: subscription.restrictionComment,
                customerPrefferedLanguage: subscription.customer.getPersonalInfo().preferredLanguage || "",
            });
        }

        this.exportService.exportSubscriptions(subscriptionsExport);

        return;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
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
