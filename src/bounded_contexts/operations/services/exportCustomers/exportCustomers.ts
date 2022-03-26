import { CustomerExport, IExportService } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";

export class ExportCustomers {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _exportService: IExportService;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        exportService: IExportService
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._exportService = exportService;
    }

    public async execute(): Promise<void> {
        const customers: Customer[] = await this.customerRepository.findAll();
        const subscriptions: Subscription[] = await this.subscriptionRepository.findAll(Locale.es);
        const pastOrders: Order[] = await this.orderRepository.findPastOrdersBySubscriptionIdList(
            subscriptions.map((sub) => sub.id),
            Locale.es
        );
        const subscriptionsMap: { [subscriptionId: string]: Subscription } = {};
        const customersExport: CustomerExport[] = [];
        const customerSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        const customerActiveSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        const subscriptionCustomerMap: { [subscriptionId: string]: Customer } = {};
        const customerPastOrdersMap: { [customerId: string]: Order[] } = {};

        for (let subscription of subscriptions) {
            const actualKey = subscription.customer.id.toString();
            subscriptionsMap[subscription.id.toString()] = subscription;

            customerSubscriptionsMap[actualKey] = Array.isArray(customerSubscriptionsMap[actualKey])
                ? [...customerSubscriptionsMap[actualKey], subscription]
                : [subscription];

            customerActiveSubscriptionsMap[actualKey] =
                Array.isArray(customerActiveSubscriptionsMap[actualKey]) &&
                subscription.state.isActive() &&
                !subscription.frequency.isOneTime()
                    ? [...customerActiveSubscriptionsMap[actualKey], subscription]
                    : subscription.state.isActive() && !subscription.frequency.isOneTime()
                    ? [subscription]
                    : customerActiveSubscriptionsMap[actualKey] || [];

            subscriptionCustomerMap[subscription.id.value] = subscription.customer;
        }

        for (let order of pastOrders) {
            const orderSubscription = subscriptionsMap[order.subscriptionId.toString()];
            const customer: Customer = subscriptionCustomerMap[order.subscriptionId.value as string];
            customerPastOrdersMap[customer.id.toString()] = Array.isArray(customerPastOrdersMap[customer.id.value])
                ? [...customerPastOrdersMap[customer.id.toString()], order]
                : [order];

            if (orderSubscription.isAOneTimeSubAndWasDelivered(order)) {
                customerActiveSubscriptionsMap[order.customer.id.toString()] = [
                    ...customerActiveSubscriptionsMap[order.customer.id.toString()],
                    orderSubscription,
                ];
            }
        }

        for (let customer of customers) {
            customersExport.push({
                customerId: customer.id.value,
                customerFirstName: customer.getPersonalInfo().name || "",
                customerLastName: customer.getPersonalInfo().lastName || "",
                customerEmail: customer.email,
                createdAt: MomentTimeService.getDateHumanLabel(customer.createdAt),
                status: customer.getCustomerStatus(
                    customerSubscriptionsMap[customer.id.toString()] ?? [],
                    customerPastOrdersMap[customer.id.toString()] || []
                ),
                billingName: customer.getBillingData().customerName || "",
                billingLastName: customer.billingAddress?.identification || "",
                billingAddressName: customer.getBillingData().addressName || "",
                billingAddressDetails: customer.getBillingData().details || "",
                billingCity: "",
                billingProvince: "",
                billingZipCode: "",
                billingCountry: "",
                billingPhoneNumber: customer.getPersonalInfo().phone1 ?? "",
                billingPhoneNumber2: customer.getPersonalInfo().phone2 ?? "",
                shippingAddressName: customer.getShippingAddress().addressName || "",
                shippingAddressDetails: customer.getShippingAddress().addressDetails || "",
                shippingAddressCity: "",
                shippingAddressProvince: "",
                shippingAddressZipCode: "",
                shippingCountry: "España",
                shopifyCustomerId: "",
                pastOrdersCount: (customerPastOrdersMap[customer.id.value]?.length || 0) + (customer.shopifyReceivedOrdersQuantity ?? 0),
                numberOfActiveSubscriptions: customerActiveSubscriptionsMap[customer.id.value]?.length || 0,
                numberOfSubscriptions: customerSubscriptionsMap[customer.id.value]?.length || 0,
                "Fecha de nacimiento": customer.getPersonalInfo().birthDate ?? "",
                "Idioma de preferencia": customer.getPersonalInfo().preferredLanguage ?? "",
                MGM: customer.friendCode ?? "",
                shopifyFirstDeliveryDate: customer.firstOrderDate ?? "",
            });
        }

        this.exportService.exportCustomers(customersExport);
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
     * Getter exportService
     * @return {IExportService}
     */
    public get exportService(): IExportService {
        return this._exportService;
    }
}
