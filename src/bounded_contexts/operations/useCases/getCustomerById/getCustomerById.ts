import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { GetCustomerByIdDto } from "./getCustomerByIdDto";

export class GetCustomerById {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(customerRepository: ICustomerRepository, storageService: IStorageService) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetCustomerByIdDto): Promise<Customer> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(customerId);

        return customer;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
