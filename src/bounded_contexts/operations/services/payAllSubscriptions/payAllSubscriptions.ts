import { INotificationService, PaymentOrderBilledNotificationDto } from "@src/shared/notificationService/INotificationService";
import Stripe from "stripe";
import { logger } from "../../../../../config";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Week } from "../../domain/week/Week";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { PayAllSubscriptionsDto } from "./payAllSubscriptionsDto";
import { PaymentIntent } from "../../application/paymentService";
import { WalletMovementLogType } from "../../domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";
export class PayAllSubscriptions {
    private _customerRepository: ICustomerRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _paymentService: IPaymentService;
    private _subscriptionRepository: ISubscriptionRepository;
    private _weekRepository: IWeekRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _notificationService: INotificationService;

    constructor(
        customerRepository: ICustomerRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        paymentService: IPaymentService,
        subscriptionRepository: ISubscriptionRepository,
        weekRepository: IWeekRepository,
        shippingZoneRepository: IShippingZoneRepository,
        notificationService: INotificationService
    ) {
        this._customerRepository = customerRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._paymentService = paymentService;
        this._subscriptionRepository = subscriptionRepository;
        this._weekRepository = weekRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._notificationService = notificationService;
    }

    public async execute(dto: PayAllSubscriptionsDto): Promise<void> {
        if (process.env.NODE_ENV === "production") logger.info(`*********************************** STARTING BILLING JOB ***********************************`);
        const today: Date = dto.executionDate ? new Date(dto.executionDate) : new Date()
        today.setHours(0, 0, 0, 0);
        const customers: Customer[] = await this.customerRepository.findAll();
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAllActive();
        const paymentOrdersToBill: PaymentOrder[] = await this.paymentOrderRepository.findByBillingDate(today);
        const ordersToBill: Order[] = await this.orderRepository.findByPaymentOrderIdList(
            paymentOrdersToBill.map((po) => po.id),
            Locale.es
        );
        const activeSusbcriptions = await this.subscriptionRepository.findByIdList(ordersToBill.map((order) => order.subscriptionId));
        var paymentOrdersWithHumanIdCount = await this.paymentOrderRepository.countPaymentOrdersWithHumanId();
        const ordersWIthoutPaymentOrder = [];
        const customerMap: { [customerId: string]: Customer } = {};
        const paymentOrderOrderMap: { [paymentOrderId: string]: Order[] } = {};
        const subscriptionOrderMap: { [subscriptionId: string]: Order } = {};
        const rejectedPaymentOrders: PaymentOrder[] = [];
        const ordersWithError: Order[] = [];
        const weeklyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveWeeksLater(dto.executionDate);
        const biweeklyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveBiweeksLater(dto.executionDate);
        const monthlyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveMonthsLater(dto.executionDate);
        const newOrders: Order[] = [];
        const frequencyWeekMap: { [frequency: string]: Week } = {};
        const customerShippingZoneMap: { [customerId: string]: ShippingZone | undefined } = {};
        const notificationDtos: PaymentOrderBilledNotificationDto[] = [];

        if (!!!weeklyOrdersWeek || !!!biweeklyOrdersWeek || !!!monthlyOrdersWeek)
            throw new Error("Error al obtener las semanas para una nueva orden");

        frequencyWeekMap["weekly"] = weeklyOrdersWeek;
        frequencyWeekMap["biweekly"] = biweeklyOrdersWeek;
        frequencyWeekMap["monthly"] = monthlyOrdersWeek;

        // CUSTOMERS MAP
        for (let customer of customers) {
            const customerShippingZone = shippingZones.find((shippingZone) =>
                //@ts-ignore
                shippingZone.hasAddressInside(customer.shippingAddress?.latitude, customer.shippingAddress?.longitude)
            );

            customerMap[customer.id.value] = customer;
            customerShippingZoneMap[customer.id.value] = customerShippingZone;
        }


        // PAYMENT ORDER - ORDER MAP
        for (let order of ordersToBill) {
            const actualKey = order.paymentOrderId?.value;

            if (!actualKey) {
                ordersWIthoutPaymentOrder.push(order);
            } else {
                paymentOrderOrderMap[actualKey] = Array.isArray(paymentOrderOrderMap[actualKey])
                    ? [...paymentOrderOrderMap[actualKey], order]
                    : [order];
            }

            subscriptionOrderMap[order.subscriptionId.value] = order;
        }

        if (process.env.NODE_ENV === "production") logger.info(`${ordersToBill.length} orders to process`);

        // PAYMENT ORDERS BILLING
        for (let paymentOrderToBill of paymentOrdersToBill) {
            if (paymentOrderToBill.isActive()) {
                const paymentOrderId: string = paymentOrderToBill.id.value as string;
                try {
                    if (process.env.NODE_ENV === "production") logger.info(`Starting payment order ${paymentOrderId} processing`);
                    const paymentOrderCustomer = customerMap[paymentOrderToBill.customerId.value];
                    const customerHasFreeShipping = paymentOrderOrderMap[paymentOrderId]?.some(
                        (order) => order.hasFreeShipping
                    );
                    const shippingCost = customerHasFreeShipping ? 0 : customerShippingZoneMap[paymentOrderCustomer.id.value]?.cost ?? 0;
                    const totalAmount = this.getTotalAmountToBill(shippingCost, paymentOrderToBill.amount, paymentOrderToBill.discountAmount)

                    const paymentIntent = await this.charge(totalAmount, paymentOrderCustomer)

                    // TO DO: Handlear insuficiencia de fondos | pagos rechazados | etc
                    if (paymentIntent.status === "succeeded") {
                        paymentOrderToBill.addHumanId(paymentOrdersWithHumanIdCount);
                        paymentOrdersWithHumanIdCount++;
                        const notificationDto = {
                            customerEmail: paymentOrderCustomer.email,
                            foodVAT: Math.round((totalAmount * 0.1 + Number.EPSILON) * 100) / 100,
                            phoneNumber: paymentOrderCustomer.personalInfo?.phone1 || "",
                            shippingAddressCity: "",
                            shippingAddressName: paymentOrderCustomer.getShippingAddress().addressName || "",
                            shippingCost,
                            shippingCustomerName: paymentOrderCustomer.getPersonalInfo().fullName || "",
                            shippingDate: paymentOrderOrderMap[paymentOrderId]?.[0].getHumanShippmentDay(
                                (<any>Locale)[paymentOrderCustomer.personalInfo?.preferredLanguage || "es"]
                            ),
                            totalAmount,
                            orders: paymentOrderOrderMap[paymentOrderId]?.filter((order) => !order.isCancelled() && !order.isSkipped()),
                            paymentOrderHumanNumber: paymentOrderToBill.getHumanIdOrIdValue() as string,
                            discountAmount: paymentOrderToBill.getDiscountAmountOrShippingCostIfHasFreeShipping(),
                        }
                        if (process.env.NODE_ENV === "production") logger.info(`${paymentOrderId} processing succeeded`);
                        paymentOrderToBill.toBilled(paymentOrderOrderMap[paymentOrderId] ?? [], paymentOrderCustomer);
                        notificationDtos.push(notificationDto);
                    } else {
                        if (process.env.NODE_ENV === "production") logger.info(`${paymentOrderId} processing failed`);
                        paymentOrderToBill.toRejected(paymentOrderOrderMap[paymentOrderId] ?? []);
                    }

                    paymentOrderToBill.paymentIntentId = paymentIntent.id;
                } catch (error: any) {
                    console.log("Error: ", error)
                    if (process.env.NODE_ENV === "production") logger.info(`${paymentOrderId} processing failed with error type ${error.type} and error code ${error.code}`);
                    paymentOrderToBill.toRejected(paymentOrderOrderMap[paymentOrderId] ?? []);
                    paymentOrderToBill.paymentIntentId = error?.payment_intent?.id ?? "";
                }
            } else {
                if (process.env.NODE_ENV === "production") logger.info(`Skipping payment order ${paymentOrderToBill.id.value} due to state ${paymentOrderToBill.state.title}`);
            }
        }

        const customerNewOrdersMap: { [customerId: string]: Order[] } = {};

        // CREATE NEW ORDERS AND ASSIGN IT IN CUSTOMER MAP
        for (let subscription of activeSusbcriptions) {
            const subscriptionId = subscription.id.value;
            const customerId = subscription.customer.id.value;
            const baseOrderForCreatingThe12Order = subscriptionOrderMap[subscriptionId];
            if (subscription.isCancelled()) continue;
            if (subscription.frequency.isOneTime()) continue // TODO: End subscription

            if (
                baseOrderForCreatingThe12Order.isActive() ||
                baseOrderForCreatingThe12Order.isSkipped() ||
                baseOrderForCreatingThe12Order.isPaymentRejected() ||
                baseOrderForCreatingThe12Order.isBilled()
            ) {
                const newOrder = subscription.getNewOrderAfterBilling(
                    subscriptionOrderMap[subscriptionId],
                    frequencyWeekMap[subscription.frequency.value()],
                    customerShippingZoneMap[subscription.customer.id.value]!
                );

                customerNewOrdersMap[customerId] = Array.isArray(customerNewOrdersMap[customerId])
                    ? [...customerNewOrdersMap[customerId], newOrder]
                    : [newOrder];
                newOrders.push(newOrder);
            }
        }

        const newPaymentOrders: PaymentOrder[] = [];

        // NEW PAYMENT ORDERS && PAYMENT ORDER ASSIGNMENT BY BILLINGDATE

        for (let customerAndNewOrders of Object.entries(customerNewOrdersMap)) {
            const customerId = new CustomerId(customerAndNewOrders[0]);

            const billingDateOrdersMap: { [billingDate: string]: Order[] } = {};

            for (let order of customerAndNewOrders[1]) {
                const billingDateTime: string = order.billingDate.toString();

                billingDateOrdersMap[billingDateTime] = Array.isArray(billingDateOrdersMap[billingDateTime])
                    ? [...billingDateOrdersMap[billingDateTime], order]
                    : [order];
            }

            for (let billingDateAndOrders of Object.entries(billingDateOrdersMap)) {
                const ordersAmount = billingDateAndOrders[1].reduce(
                    (acc, order) => (Math.round(acc * 100) + Math.round(order.getTotalPrice() * 100)) / 100,
                    0
                ); // TO DO: Use coupons, probably need to pass orders to a subscription
                const ordersDiscount = billingDateAndOrders[1].reduce(
                    (acc, order) => (Math.round(acc * 100) + Math.round(order.discountAmount * 100)) / 100,
                    0
                ); // TO DO: Use coupons, probably need to pass orders to a subscription

                const hasFreeShipping = billingDateAndOrders[1].some((order) => order.hasFreeShipping);
                // Validar si para este cliente ya existe una payment order con billingDateAndOrders[0].
                // Si existe, agregar billingDateAndOrders[1] a la paymentOrder en vez de crear una nueva

                const existentPaymentOrder = await this.paymentOrderRepository.findActiveByCustomerAndBillingDate(
                    new Date(billingDateAndOrders[0]),
                    customerId
                );

                if (!!existentPaymentOrder) {
                    if (process.env.NODE_ENV === "production") logger.info(`Existe una orden para el ${new Date(billingDateAndOrders[0])}`);

                    billingDateAndOrders[1].forEach((order) => existentPaymentOrder.addOrder(order));
                    // existentPaymentOrder.addOrder()
                    paymentOrdersToBill.push(existentPaymentOrder); // Is not going to be billed, its just an aweful name for updating the existent PO with the repository
                } else {
                    const newPaymentOrder = new PaymentOrder(
                        billingDateAndOrders[1][0].shippingDate || new Date(today),
                        new PaymentOrderActive(),
                        "",
                        new Date(billingDateAndOrders[0]),
                        weeklyOrdersWeek, // TO DO: Week is unnecessary in payment orders
                        ordersAmount,
                        ordersDiscount,
                        customerShippingZoneMap[customerAndNewOrders[0]]?.cost!,
                        new CustomerId(customerAndNewOrders[0]),
                        hasFreeShipping
                    );

                    newPaymentOrders.push(newPaymentOrder);
                    billingDateAndOrders[1].forEach((order) => (order.paymentOrderId = newPaymentOrder.id));
                }
            }
        }

        // ASSIGN COUPON CODE TO BILLED ORDERS
        for (const sub of activeSusbcriptions) {
            const order = subscriptionOrderMap[sub.id.toString()]
            if (!order?.isBilled()) continue;

            order.couponCode = sub.coupon?.couponCode ?? ""
        }

        if (process.env.NODE_ENV === "production") logger.info(`${paymentOrdersToBill.filter((po) => po.state.isBilled()).length} processed succesfully`);
        if (process.env.NODE_ENV === "production") logger.info(`${paymentOrdersToBill.filter((po) => po.state.isRejected()).length} with payment rejected`);
        if (process.env.NODE_ENV === "production") logger.info(`${paymentOrdersToBill.filter((po) => po.state.isRejected()).map((po) => po.id.value)}`);

        // await this.orderRepository.saveOrdersWithNewState(ordersToBill);
        await this.orderRepository.updateMany(ordersToBill);
        await this.orderRepository.insertMany(newOrders);
        await this.paymentOrderRepository.updateMany(paymentOrdersToBill);
        await this.paymentOrderRepository.bulkSave(newPaymentOrders);
        await this.customerRepository.updateMany(customers);
        if (process.env.NODE_ENV !== "staging") {
            for (let dto of notificationDtos) {
                await this.notificationService.notifyCustomerAboutPaymentOrderBilled(dto);
            }
        }
        if (process.env.NODE_ENV === "production") logger.info(`*********************************** BILLING JOB ENDED ***********************************`);
    }

    public getTotalAmountToBill(shippingCost: number, planAmount: number, discountAmount: number): number {
        const totalAmount =
            (Math.round(planAmount * 100) -
                Math.round(discountAmount * 100) +
                Math.round(shippingCost * 100)) /
            100;

        return totalAmount
    }

    private async charge(totalAmount: number, customer: Customer): Promise<Stripe.PaymentIntent | PaymentIntent> {
        if (customer.getDefaultPaymentMethod()?.id.toString() === "wallet") return this.chargeWithWallet(totalAmount, customer)
        var paymentIntent: Stripe.PaymentIntent | PaymentIntent = {
            id: "",
            status: "succeeded",
            client_secret: "",
            amount: 0
        };

        if (totalAmount >= 0.5) {
            paymentIntent = await this.paymentService.paymentIntent(
                totalAmount,
                customer.getDefaultPaymentMethod()?.stripeId!,
                customer.email,
                customer.stripeId as string,
                true
            );
        }
        return paymentIntent

    }

    private chargeWithWallet(totalAmount: number, customer: Customer): PaymentIntent {
        var paymentIntent: PaymentIntent = {
            id: "Monedero",
            status: "succeeded",
            client_secret: "",
            amount: totalAmount
        };

        const succeeded = customer.payBillingJobWithWallet(totalAmount)

        if (!succeeded) {
            paymentIntent.status = "cancelled"
            customer.addWalletMovementLog(WalletMovementLogType.PAYMENT_REJECTED, totalAmount)
        }



        return paymentIntent

    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
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
