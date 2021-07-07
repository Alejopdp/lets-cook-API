import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Address } from "../../domain/address/Address";
import { AddressId } from "../../domain/address/AddressId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerBillingDto } from "./updateCustomerBillingDto";

export class UpdateCustomerBilling {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(
        customerRepository: ICustomerRepository,
        storageService: IStorageService,
    ) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCustomerBillingDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        
        if (!customer) throw new Error("Error al buscar el cliente");
        
        customer.changeBillingAddress(dto.lat, dto.long, dto.name, dto.fullName, dto.details, dto.identification)

        await this.customerRepository.save(customer);
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
