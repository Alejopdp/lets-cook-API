import { INotificationService, NewSubscriptionNotificationDto } from "../../../../shared/notificationService/INotificationService";
import { Order } from "../../domain/order/Order";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { SendNewSubscriptionEmailDto } from "./sendNewSubscriptionEmailDto";

export class SendNewSubscriptionEmail {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _notificationService: INotificationService;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        shippingZoneRepository: IShippingZoneRepository,
        notificationService: INotificationService
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._notificationService = notificationService;
    }
    public async execute(dto: SendNewSubscriptionEmailDto): Promise<any> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(subscriptionId);
        const firstOrder: Order | undefined = await this.orderRepository.getFirstOrderOfSubscription(subscriptionId, dto.locale);
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();

        const customerShippingZone = shippingZones.find((zone) =>
            zone.hasAddressInside(subscription.customer.shippingAddress?.latitude!, subscription.customer.shippingAddress?.longitude!)
        );

        const notificationDto: NewSubscriptionNotificationDto = {
            customerEmail: subscription.customer.email,
            customerFirstName: subscription.customer.email,
            customerLastName: subscription.customer.personalInfo?.lastName || "",
            recipeSelection: firstOrder ? firstOrder.recipeSelection : [],
            planName: subscription.plan.name,
            firstOrderId: firstOrder ? (firstOrder.id.value as string) : "",
            hasIndicatedRestrictions: subscription.restrictionComment,
            shippingCost: customerShippingZone?.cost!,
            shippingDay: customerShippingZone?.getDayLabel()!,
            isPlanAhorro: subscription.plan.planSlug.slug === "plan-ahorro",
            planSku: subscription.plan.planSku.code,
        };

        await this.notificationService.notifyCustomerAboutNewSubscriptionSuccessfullyCreated(notificationDto);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
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
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }
}
