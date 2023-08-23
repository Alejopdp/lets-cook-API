import { CustomerId } from "../../domain/customer/CustomerId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ChargeMoneyToWallet } from "../../services/chargeMoneyToWallet/chargeMoneyToWallet";
import { ChargeMoneyToWalletDto } from "./chargeMoneyToWalletDto";

export class ChargeMoneyToWalletUseCase {
    private _customerRepository: ICustomerRepository;
    private _chargeMoneyService: ChargeMoneyToWallet;

    constructor(customerRepository: ICustomerRepository, chargeMoneyService: ChargeMoneyToWallet) {
        this._customerRepository = customerRepository
        this._chargeMoneyService = chargeMoneyService

    }
    public async execute(dto: ChargeMoneyToWalletDto): Promise<any> {
        const customer = await this.customerRepository.findByIdOrThrow(new CustomerId(dto.customerId))

        await this.chargeMoneyService.execute({ customer, amountToCharge: dto.amountToCharge })
        await this.customerRepository.save(customer)
    }


    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter chargeMoneyService
     * @return {ChargeMoneyToWallet}
     */
    public get chargeMoneyService(): ChargeMoneyToWallet {
        return this._chargeMoneyService;
    }
}