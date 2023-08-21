import { CustomerId } from "../../domain/customer/CustomerId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CreateWalletDto } from "./createWalletDto";

export class CreateWallet {
    private _customerRepository: ICustomerRepository;

    constructor(repository1: ICustomerRepository) {
        this._customerRepository = repository1
    }
    public async execute(dto: CreateWalletDto): Promise<any> {
        const customer = await this.customerRepository.findByIdOrThrow(new CustomerId(dto.customerId));

        // customer.createWallet(dto.amountToCharge, dto.paymentMethodForCharging);

        // await this._customerRepository.save(customer);
    }


    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}