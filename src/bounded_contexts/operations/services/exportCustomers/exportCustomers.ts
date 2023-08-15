import { CustomerExport, IExportService } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { performance } from 'perf_hooks';
import { ExportCustomersDto } from "./exportCustomersDto";



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

    public async execute(dto: ExportCustomersDto): Promise<void> {

        const start = performance.now();
        const customers: Customer[] = await this.customerRepository.findBy(dto.createdAt ? { createdAt: { $gte: dto.createdAt } } : {});
        const subscriptions: Subscription[] = await this.subscriptionRepository.findBy({ customer: { $in: customers.map((customer) => customer.id.toString()) } }, Locale.es)
        const end = performance.now();
        console.log(`Customers & Subscriptions tardó ${end - start} milisegundos en ejecutarse`);
        const start2 = performance.now();
        const pastOrders: Order[] = await this.orderRepository.findPastOrdersBySubscriptionIdList(
            subscriptions.map((sub) => sub.id),
            Locale.es
        );
        const end2 = performance.now();
        console.log(`Past orders tardó ${end2 - start2} milisegundos en ejecutarse`);
        const subscriptionsMap: { [subscriptionId: string]: Subscription } = {};
        const customersExport: CustomerExport[] = [];
        const customerSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        const customerActiveSubscriptionsMap: { [customerId: string]: Subscription[] } = {};
        const subscriptionCustomerMap: { [subscriptionId: string]: Customer } = {};
        const customerPastOrdersMap: { [customerId: string]: Order[] } = {};
        const start3 = performance.now();

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
                createdAt: MomentTimeService.getDdMmYyyy(customer.createdAt),
                status: customer.getCustomerStatus(
                    customerSubscriptionsMap[customer.id.toString()] ?? [],
                    customerPastOrdersMap[customer.id.toString()] || []
                ),
                billingName: customer.getBillingData().customerName || "",
                "DNI / NIE / CIF": customer.billingAddress?.identification || "",
                billingAddressName: customer.getBillingData().addressName || "",
                billingAddressDetails: customer.getBillingData().details || "",
                billingCity: customer.getBillingData().city || "",
                billingProvince: customer.getBillingData().province || "",
                billingZipCode: customer.getBillingData().postalCode || "",
                billingCountry: customer.getBillingData().country || "",
                billingPhoneNumber: customer.getPersonalInfo().phone1 ?? "",
                billingPhoneNumber2: customer.getPersonalInfo().phone2 ?? "",
                shippingAddressName: customer.getShippingAddress().addressName || "",
                shippingAddressDetails: customer.getShippingAddress().addressDetails || "",
                shippingAddressCity: customer.getShippingAddress().city || "",
                shippingAddressProvince: customer.getShippingAddress().province || "",
                shippingAddressZipCode: customer.getShippingAddress().postalCode || "",
                shippingCountry: customer.getShippingAddress().country || "",
                shopifyCustomerId: "",
                pastOrdersCount: (customerPastOrdersMap[customer.id.value]?.length || 0) + (customer.shopifyReceivedOrdersQuantity ?? 0),
                numberOfActiveSubscriptions: customerActiveSubscriptionsMap[customer.id.value]?.length || 0,
                numberOfSubscriptions: customerSubscriptionsMap[customer.id.value]?.length || 0,
                "Fecha de nacimiento": customer.getPersonalInfo().birthDate ? MomentTimeService.getDdMmYyyy(customer.getPersonalInfo().birthDate!) : "",
                "Idioma de preferencia": customer.getPersonalInfo().preferredLanguage ?? "",
                MGM: customer.friendCode ?? "",
                shopifyFirstDeliveryDate: customer.firstOrderDate ?? "",
            });
        }
        const end3 = performance.now();
        console.log(`El resto tardó ${end3 - start3} milisegundos en ejecutarse`);


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
