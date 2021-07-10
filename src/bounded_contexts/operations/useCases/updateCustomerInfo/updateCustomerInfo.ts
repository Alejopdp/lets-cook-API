import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";

import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerInfoDto } from "./updateCustomerInfoDto";

export class UpdateCustomerInfo {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(customerRepository: ICustomerRepository, storageService: IStorageService) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCustomerInfoDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);

        if (!customer) throw new Error("Error al buscar el cliente");

        customer.changePersonalInfo(dto.name, dto.lastName, dto.phone1, dto.phone2, new Date(dto.birthDate), dto.preferredLanguage);

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
