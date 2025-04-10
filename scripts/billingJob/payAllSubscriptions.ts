import { INotificationService, PaymentOrderBilledNotificationDto } from "../../src/shared/notificationService/INotificationService";
import Stripe from "stripe";
import { IPaymentService } from "../../src/bounded_contexts/operations/application/paymentService/IPaymentService";
import { Customer } from "../../src/bounded_contexts/operations/domain/customer/Customer";
import { CustomerId } from "../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { Locale } from "../../src/bounded_contexts/operations/domain/locale/Locale";
import { Order } from "../../src/bounded_contexts/operations/domain/order/Order";
import { PaymentOrder } from "../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../src/bounded_contexts/operations/domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { ShippingZone } from "../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { Week } from "../../src/bounded_contexts/operations/domain/week/Week";
import { ICustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../src/bounded_contexts/operations/infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../src/bounded_contexts/operations/infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IShippingZoneRepository } from "../../src/bounded_contexts/operations/infra/repositories/shipping/IShippingZoneRepository";
import { ISubscriptionRepository } from "../../src/bounded_contexts/operations/infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../src/bounded_contexts/operations/infra/repositories/week/IWeekRepository";
import { logger } from "../../config";
import { awsSesV3Service } from "../../src/shared/notificationService/index";
import { stripeService } from "../../src/bounded_contexts/operations/application/paymentService";
import { mongooseCustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer";
import { mongooseOrderRepository } from "../../src/bounded_contexts/operations/infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../src/bounded_contexts/operations/infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../src/bounded_contexts/operations/infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../src/bounded_contexts/operations/infra/repositories/subscription";
import { mongooseWeekRepository } from "../../src/bounded_contexts/operations/infra/repositories/week";
import { connectToDatabase } from "../../src/infraestructure/mongoose/config/config";


class PayAllSubscriptions {
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

    public async execute(fromDate: Date, howManyTimes: number): Promise<void> {
        for (let i = 0; i < howManyTimes; i++) {

            if (process.env.NODE_ENV === "production") logger.info(`*********************************** STARTING BILLING JOB ***********************************`);
            // const today: Date = new Date(2021, 11, 25);
            if (fromDate.getDay() !== 6) throw new Error("From date should be saturday")
            const today: Date = fromDate
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
            const ordersWIthoutPaymentOrder: Order[] = [];
            const customerMap: { [customerId: string]: Customer } = {};
            const paymentOrderOrderMap: { [paymentOrderId: string]: Order[] } = {};
            const subscriptionOrderMap: { [subscriptionId: string]: Order } = {};
            const rejectedPaymentOrders: PaymentOrder[] = [];
            const ordersWithError: Order[] = [];
            const weeklyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveWeeksLater();
            const biweeklyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveBiweeksLater();
            const monthlyOrdersWeek: Week | undefined = await this.weekRepository.findWeekTwelveMonthsLater();
            const newOrders: Order[] = [];
            const frequencyWeekMap: { [frequency: string]: Week } = {};
            const customerShippingZoneMap: { [customerId: string]: ShippingZone | undefined } = {};
            const notificationDtos: PaymentOrderBilledNotificationDto[] = [];

            if (!!!weeklyOrdersWeek || !!!biweeklyOrdersWeek || !!!monthlyOrdersWeek)
                throw new Error("Error al obtener las semanas para una nueva orden");

            frequencyWeekMap["weekly"] = weeklyOrdersWeek;
            frequencyWeekMap["biweekly"] = biweeklyOrdersWeek;
            frequencyWeekMap["monthly"] = monthlyOrdersWeek;

            console.log("Weeks for biweekly subs: ", JSON.stringify(biweeklyOrdersWeek))

            // CUSTOMERS MAP
            for (let customer of customers) {
                const customerShippingZone = shippingZones.find((shippingZone) =>
                    //@ts-ignore
                    shippingZone.hasAddressInside(customer.shippingAddress?.latitude, customer.shippingAddress?.longitude)
                );

                customerMap[customer.id.value] = customer;
                customerShippingZoneMap[customer.id.value] = customerShippingZone;
            }

            // CUSTOMER SHIPPING ZONE REPOSITORY

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
                if (paymentOrderToBill.state.title === "PAYMENT_ORDER_ACTIVE") {
                    const paymentOrderId: string = paymentOrderToBill.id.value as string;
                    try {
                        if (process.env.NODE_ENV === "production") logger.info(`Starting payment order ${paymentOrderId} processing`);
                        const paymentOrderCustomer = customerMap[paymentOrderToBill.customerId.value];
                        const shippingCost = customerShippingZoneMap[paymentOrderCustomer.id.value]?.cost ?? 0;
                        const customerHasFreeShipping = paymentOrderOrderMap[paymentOrderToBill.id.value].some(
                            (order) => order.hasFreeShipping
                        );
                        const totalAmount = customerHasFreeShipping
                            ? (Math.round(paymentOrderToBill.amount * 100) - Math.round(paymentOrderToBill.discountAmount * 100)) / 100
                            : (Math.round(paymentOrderToBill.amount * 100) -
                                Math.round(paymentOrderToBill.discountAmount * 100) +
                                Math.round(shippingCost * 100)) /
                            100;

                        var paymentIntent: Stripe.PaymentIntent | { id: string; status: string; client_secret: string } = {
                            id: "",
                            status: "succeeded",
                            client_secret: "",
                        };

                        if (totalAmount >= 0.5) {
                            paymentIntent = await this.paymentService.paymentIntent(
                                totalAmount,
                                paymentOrderCustomer.getDefaultPaymentMethod()?.stripeId!,
                                paymentOrderCustomer.email,
                                paymentOrderCustomer.stripeId as string,
                                true
                            );
                        }

                        paymentOrderToBill.addHumanId(paymentOrdersWithHumanIdCount);
                        paymentOrdersWithHumanIdCount++;
                        // TO DO: Handlear insuficiencia de fondos | pagos rechazados | etc
                        if (paymentIntent.status === "succeeded") {
                            const notificationDto = {
                                customerEmail: paymentOrderCustomer.email,
                                foodVAT: Math.round((totalAmount * 0.1 + Number.EPSILON) * 100) / 100,
                                phoneNumber: paymentOrderCustomer.personalInfo?.phone1 || "",
                                shippingAddressCity: "",
                                shippingAddressName: paymentOrderCustomer.getShippingAddress().addressName || "",
                                shippingCost: customerHasFreeShipping ? 0 : shippingCost,
                                shippingCustomerName: paymentOrderCustomer.getPersonalInfo().fullName || "",
                                shippingDate: paymentOrderOrderMap[paymentOrderId][0].getHumanShippmentDay(
                                    (<any>Locale)[paymentOrderCustomer.personalInfo?.preferredLanguage || "es"]
                                ),
                                totalAmount,
                                orders: paymentOrderOrderMap[paymentOrderId].filter((order) => !order.isCancelled()),
                                paymentOrderHumanNumber: paymentOrderToBill.getHumanIdOrIdValue() as string,
                                discountAmount: paymentOrderToBill.getDiscountAmountOrShippingCostIfHasFreeShipping(),
                            }
                            if (process.env.NODE_ENV === "production") logger.info(`${paymentOrderId} processing succeeded`);
                            paymentOrderToBill.toBilled(paymentOrderOrderMap[paymentOrderId], paymentOrderCustomer);
                            notificationDtos.push(notificationDto);
                        } else {
                            if (process.env.NODE_ENV === "production") logger.info(`${paymentOrderId} processing failed`);
                            paymentOrderToBill.toRejected(paymentOrderOrderMap[paymentOrderId]);
                        }

                        paymentOrderToBill.paymentIntentId = paymentIntent.id;
                    } catch (error: any) {
                        // @ts-ignore
                        if (process.env.NODE_ENV === "production") logger.info(`${paymentOrderId} processing failed with error type ${error.type} and error code ${error.code}`);
                        paymentOrderToBill.toRejected(paymentOrderOrderMap[paymentOrderId]);
                        // @ts-ignore
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
                if (subscription.state.isCancelled()) continue;
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
                            billingDateAndOrders[1][0].shippingDate || new Date(),
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

            today.setDate(today.getDate() + 7)
        }
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

async function runScript() {
    process.env.NODE_ENV = "development"
    process.env.STRIPE_SECRET_KEY = "sk_test_9ixChBmgrwQyQn814Tb8gRbm00nQx5UuDU"
    process.env.URLDB = "mongodb+srv://lets_cook_admin:Rwn7Bu2VJqju6Yia@ecommerce.6octe.mongodb.net/"

    await connectToDatabase()

    const script = new PayAllSubscriptions(mongooseCustomerRepository,
        mongooseOrderRepository,
        mongoosePaymentOrderReposiotry,
        stripeService,
        mongooseSubscriptionRepository,
        mongooseWeekRepository,
        mongooseShippingZoneRepository,
        awsSesV3Service
    )

    const firstSaturday = new Date(2022, 9, 29)
    script.execute(firstSaturday, 32)
}

runScript()