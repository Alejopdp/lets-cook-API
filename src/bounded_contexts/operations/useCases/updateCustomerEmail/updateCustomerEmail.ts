import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerEmailDto } from "./updateCustomerEmailDto";

export class UpdateCustomerEmail {
    private _customerRepository: ICustomerRepository;

    constructor(customerRepository: ICustomerRepository) {
        this._customerRepository = customerRepository;
    }

    public async execute(dto: UpdateCustomerEmailDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        console.log(customer);
        if (!customer) throw new Error("Error al buscar el cliente");

        customer.email = dto.email;

        await this.customerRepository.save(customer);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
