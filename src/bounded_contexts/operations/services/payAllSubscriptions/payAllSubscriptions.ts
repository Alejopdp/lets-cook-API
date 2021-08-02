import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
export class PayAllSubscriptions {
    private _customerRepository: ICustomerRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _paymentService: IPaymentService;

    constructor(
        customerRepository: ICustomerRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        paymentService: IPaymentService
    ) {
        this._customerRepository = customerRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._paymentService = paymentService;
    }

    public async execute(): Promise<void> {
        const customers: Customer[] = await this.customerRepository.findAll();
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0);
        const paymentOrdersToBill: PaymentOrder[] = await this.paymentOrderRepository.findActiveByBillingDate(today);
        const customerMap: { [customerId: string]: Customer } = {};

        for (let customer of customers) {
            customerMap[customer.id.value] = customer;
        }

        for (let paymentOrderToBill of paymentOrdersToBill) {
            const paymentOrderCustomer = customerMap[paymentOrderToBill.customerId.value];
            await this.paymentService.paymentIntent(
                paymentOrderToBill.amount,
                "",
                paymentOrderCustomer.email,
                paymentOrderCustomer.stripeId
            );
        }
        const subscriptionCustomerMap: { [subscriptionId: string]: string | number } = {};
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
     * Getter paymentOrder
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
}
