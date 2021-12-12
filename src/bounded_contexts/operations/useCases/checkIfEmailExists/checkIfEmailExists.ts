import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CheckIfEmailExistsDto } from "./checkIfEmailExistsDto";

export class CheckIfEmailExists {
    private _customerRepository: ICustomerRepository;

    constructor(customerRepository: ICustomerRepository) {
        this._customerRepository = customerRepository;
    }

    public async execute(dto: CheckIfEmailExistsDto): Promise<any> {
        const customer: Customer | undefined = await this.customerRepository.findByEmail(dto.email);

        return !!customer;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
