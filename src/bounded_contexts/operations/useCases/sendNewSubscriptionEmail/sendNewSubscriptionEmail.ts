import {
    INotificationService,
    NewSubscriptionNotificationDto,
    PaymentOrderBilledNotificationDto,
} from "../../../../shared/notificationService/INotificationService";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { SendNewSubscriptionEmailDto } from "./sendNewSubscriptionEmailDto";

export class SendNewSubscriptionEmail {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _notificationService: INotificationService;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        shippingZoneRepository: IShippingZoneRepository,
        notificationService: INotificationService,
        paymentOrderRepository: IPaymentOrderRepository
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._notificationService = notificationService;
        this._paymentOrderRepository = paymentOrderRepository;
    }
    public async execute(dto: SendNewSubscriptionEmailDto): Promise<any> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const [subscription, firstOrder, shippingZones]: [Subscription, Order | undefined, ShippingZone[]] = await Promise.all([
            this.subscriptionRepository.findByIdOrThrow(subscriptionId),
            this.orderRepository.getFirstOrderOfSubscription(subscriptionId, dto.locale),
            this.shippingZoneRepository.findAll(),
        ]);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(firstOrder?.paymentOrderId!);

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

        const ticketDto: PaymentOrderBilledNotificationDto = {
            customerEmail: subscription.customer.email,
            foodVAT: Math.round((paymentOrder.getAmountToBillWithoutShippingCost() * 0.1 + Number.EPSILON) * 100) / 100,
            orders: [firstOrder!],
            paymentOrderHumanNumber: (paymentOrder.getHumanIdOrIdValue() as string) || "",
            phoneNumber: subscription.customer.personalInfo?.phone1 || "",
            shippingAddressCity: "",
            shippingAddressName: subscription.customer.getShippingAddress().name || "",
            shippingCost: paymentOrder.shippingCost,
            shippingCustomerName: subscription.customer.getPersonalInfo().fullName || "",
            shippingDate: firstOrder!.getHumanShippmentDay(),
            totalAmount: paymentOrder.getAmountToBillWithoutShippingCost(),
            discountAmount: paymentOrder.getDiscountAmountOrShippingCostIfHasFreeShipping(),
        };
        this.notificationService.notifyCustomerAboutPaymentOrderBilled(ticketDto);
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

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
