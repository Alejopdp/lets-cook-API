import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetCouponListPresenter } from "./getCustomerListPresenter";

export class GetCustomerList {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _storageService: IStorageService;

    constructor(customerRepository: ICustomerRepository, subscriptionRepository: ISubscriptionRepository, storageService: IStorageService) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._storageService = storageService;
    }

    public async execute(): Promise<any> {
        var customers: Customer[] = await this.customerRepository.findAll();
        const subscriptions: Subscription[] = await this.subscriptionRepository.findActiveSusbcriptionsByCustomerIdList(
            customers.map((cus) => cus.id)
        );
        // console.log("GetCoupon Use Case: ", coupons)
        return GetCouponListPresenter.present(customers, subscriptions);
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
}
