import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetCustomerInformationAsAdminDto } from "./getCustomerInformationAsAdminDto";

export class GetCustomerInformationAsAdmin {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    private _storageService: IStorageService;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        orderRepository: IOrderRepository,
        storageService: IStorageService
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
        this._storageService = storageService;
    }

    public async execute(
        dto: GetCustomerInformationAsAdminDto
    ): Promise<{ customer: Customer; subscriptions: Subscription[]; paymentOrders: PaymentOrder[]; orders: Order[] }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(customerId);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByCustomerId(customerId);
        const orders: Order[] = await this.orderRepository.findByPaymentOrderIdList(paymentOrders.map((po) => po.id));

        return { customer, subscriptions, paymentOrders, orders };
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
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
