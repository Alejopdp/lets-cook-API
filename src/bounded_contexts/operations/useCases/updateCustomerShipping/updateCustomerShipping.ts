import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Address } from "../../domain/address/Address";
import { AddressId } from "../../domain/address/AddressId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerShippingDto } from "./updateCustomerShippingDto";

export class UpdateCustomerShipping {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(
        customerRepository: ICustomerRepository,
        storageService: IStorageService,
    ) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCustomerShippingDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        
        if (!customer) throw new Error("Error al buscar el cliente");
        
        const address: Address = new Address(dto.lat, dto.long, dto.name, dto.fullName, dto.details, dto.deliveryTime, undefined);
        customer.shippingAddress = address;

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
