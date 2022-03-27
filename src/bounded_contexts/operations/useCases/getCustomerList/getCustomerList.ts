import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetCouponListPresenter } from "./getCustomerListPresenter";

export class GetCustomerList {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _storageService: IStorageService;
    private _orderRepository: IOrderRepository;

    constructor(
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        storageService: IStorageService,
        orderRepository: IOrderRepository
    ) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._storageService = storageService;
        this._orderRepository = orderRepository;
    }

    public async execute(): Promise<any> {
        var customers: Customer[] = await this.customerRepository.findAll();
        const subscriptions: Subscription[] = await this.subscriptionRepository.findActiveSusbcriptionsByCustomerIdList(
            customers.map((cus) => cus.id)
        );
        const oneTimeSubscriptionOrders: Order[] = await this.orderRepository.findOneTimeSubscriptionAndFutureOrders(Locale.es);

        return GetCouponListPresenter.present(customers, subscriptions, oneTimeSubscriptionOrders);
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
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
