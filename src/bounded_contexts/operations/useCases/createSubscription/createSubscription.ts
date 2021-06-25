import { logger } from "../../../../../config";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { CouponId } from "../../domain/cupons/CouponId";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Locale } from "../../domain/locale/Locale";
import { Plan } from "../../domain/plan/Plan";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionActive } from "../../domain/subscription/subscriptionState/SubscriptionActive";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { CreateSubscriptionDto } from "./createSubscriptionDto";

export class CreateSubscription {
    private _customerRepository: ICustomerRepository;
    private _planRepository: IPlanRepository;
    private _paymentService: IPaymentService;
    private _notificationService: INotificationService;

    constructor(
        customerRepository: ICustomerRepository,
        planRepository: IPlanRepository,
        paymentService: IPaymentService,
        notificationService: INotificationService
    ) {
        this._customerRepository = customerRepository;
        this._planRepository = planRepository;
        this._notificationService = notificationService;
        this._paymentService = paymentService;
    }

    public async execute(dto: CreateSubscriptionDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const couponId: CouponId | undefined = dto.couponId ? new CouponId() : false;
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        if (!!!customer) throw new Error("No puedes pedir un nuevo plan");

        const planFrequency: PlanFrequency = (<any>PlanFrequency)[dto.planFrequency];
        const plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.planId), Locale.es);
        if (!!!plan) throw new Error("El plan ingresado no existe");

        const planVariant: PlanVariant | undefined = plan.getPlanVariantById(new PlanVariantId(dto.planVariantId));
        if (!!!planVariant) throw new Error("La variante ingresada no existe");

        const subscription: Subscription = new Subscription(
            planVariant,
            planFrequency,
            new SubscriptionActive(),
            [],
            dto.restrictionComment,
            new Date(),
            0,
            customer,
            couponId,
            undefined,
            new Date(), // TO DO: Calculate
            undefined,
            undefined
        );

        // TO DO Create orders
        // TO DO Assign orders to orderGroups
        // TO DO Save customer, subscriptions, order and orderGroups
        // TO DO Pay Stripe
        // TO DO Notify customer
        // TO DO Email templates
        // TO DO Notify admin
        // TO DO Entity SubscriptionCoupon

        await this.notificationService.notifyAdminsAboutNewSubscriptionSuccessfullyCreated();
        await this.notificationService.notifyCustomerAboutNewSubscriptionSuccessfullyCreated();

        logger.info(`Subscription: ${JSON.stringify(subscription)}`);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Setter customerRepository
     * @param {ICustomerRepository} value
     */
    public set customerRepository(value: ICustomerRepository) {
        this._customerRepository = value;
    }

    /**
     * Setter planRepository
     * @param {IPlanRepository} value
     */
    public set planRepository(value: IPlanRepository) {
        this._planRepository = value;
    }

    /**
     * Setter paymentService
     * @param {IPaymentService} value
     */
    public set paymentService(value: IPaymentService) {
        this._paymentService = value;
    }

    /**
     * Setter notificationService
     * @param {INotificationService} value
     */
    public set notificationService(value: INotificationService) {
        this._notificationService = value;
    }
}
