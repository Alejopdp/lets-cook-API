import { CustomerId } from "../../domain/customer/CustomerId";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { DeleteCustomerDto } from "./deleteCustomerDto";

export class DeleteCustomer {
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(customerRepository: ICustomerRepository, subscriptionRepository: ISubscriptionRepository) {
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
    }

    public async execute(dto: DeleteCustomerDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId);
        let activeSubscriptions = customerSubscriptions.filter((subscription: Subscription) => subscription.state.title === 'SUBSCRIPTION_ACTIVE');

        if(activeSubscriptions.length !== 0) throw new Error("Hay suscripciones activas para el cliente seleccionado");
        
        await this.customerRepository.delete(customerId);
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
}
