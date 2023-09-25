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

        await this.chargeMoneyService.execute({ customer, amountToCharge: dto.amountToCharge, paymentMethodId: dto.paymentMethodId })
        await this.customerRepository.save(customer)

        return {
            balance: customer.wallet?.balance,
            amountToCharge: customer.wallet?.amountToCharge,
            paymentMethodForCharging: customer.wallet?.paymentMethodForCharging,
            last4Numbers: customer.paymentMethods.find(pm => pm.id.toString() === customer.wallet?.paymentMethodForCharging)?.last4Numbers ?? "",
            isEnabled: customer.wallet?.isEnabled,
            datesOfCharge: customer.wallet?.datesOfCharge.map(dateOfCharge => ({ dayNumber: dateOfCharge.day.dayNumberOfWeek, hour: dateOfCharge.hour, minute: dateOfCharge.minute })),
            walletMovementsLogs: customer.getPresentedWalletMovements(dto.locale),
        }
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