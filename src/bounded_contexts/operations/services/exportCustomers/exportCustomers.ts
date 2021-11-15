import { CustomerExport, IExportService } from "../../application/exportService/IExportService";
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
        const customersIds: CustomerId[] = customers.map((customer) => customer.id);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findAll(Locale.es);
        const pastOrders: Order[] = await this.orderRepository.findPastOrdersByCustomerIdList(
            subscriptions.map((sub) => sub.id),
            Locale.es
        );
        const customersExport: CustomerExport[] = [];
        const customerSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        const customerActiveSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        const subscriptionOrderMap: { [subscriptionId: string]: Order } = {};
        const subscriptionCustomerMap: { [subscriptionId: string]: Customer } = {};
        const customerPastOrdersMap: { [customerId: string]: Order[] } = {};

        for (let subscription of subscriptions) {
            const actualKey = subscription.customer.id.value as string;

            customerSubscriptionsMap[actualKey] = Array.isArray(customerSubscriptionsMap[actualKey])
                ? [...customerSubscriptionsMap[actualKey], subscription]
                : [subscription];

            customerActiveSubscriptionsMap[actualKey] =
                Array.isArray(customerActiveSubscriptionsMap[actualKey]) && subscription.state.isActive()
                    ? [...customerActiveSubscriptionsMap[actualKey], subscription]
                    : subscription.state.isActive()
                    ? [subscription]
                    : [];

            subscriptionCustomerMap[subscription.id.value] = subscription.customer;
        }

        for (let order of pastOrders) {
            const customer: Customer = subscriptionCustomerMap[order.subscriptionId.value as string];
            customerPastOrdersMap[customer.id.value] = Array.isArray(customerPastOrdersMap[customer.id.value])
                ? [...customerPastOrdersMap[customer.id.value], order]
                : [order];
        }

        for (let customer of customers) {
            customersExport.push({
                customerId: customer.id.value,
                customerFirstName: customer.getPersonalInfo().name || "",
                customerLastName: customer.getPersonalInfo().name || "",
                customerEmail: customer.email,
                createdAt: "",
                status: customer.state || "",
                billingFirstName: customer.getBillingData().customerName || "",
                billingLastName: customer.billingAddress?.customerName || "",
                billingAddressName: customer.getBillingData().addressName || "",
                billingAddressDetails: customer.getBillingData().details || "",
                billingCity: "N/A",
                billingProvince: "N/A",
                billingZipCode: "N/A",
                billingCountry: "España",
                billingPhoneNumber: "N/A",
                shippingAddressName: customer.getShippingAddress().name || "",
                shippingAddressDetails: customer.getShippingAddress().details || "",
                shippingAddressCity: "N/A",
                shippingAddressProvince: "N/A",
                shippingAddressZipCode: "N/A",
                shippingCountry: "España",
                shopifyCustomerId: "",
                pastOrdersCount: customerPastOrdersMap[customer.id.value]?.length || 0,
                numberOfActiveSubscriptions: customerActiveSubscriptionsMap[customer.id.value]?.length || 0,
                numberOfSubscriptions: customerSubscriptionsMap[customer.id.value]?.length || 0,
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
