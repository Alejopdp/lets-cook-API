import { CustomerId } from "../../domain/customer/CustomerId";
import { DateOfCharge } from "../../domain/customer/wallet/DateOfCharge";
import { Day } from "../../domain/day/Day";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateWalletDto } from "./updateWalletDto";

export class UpdateWallet {
    private _customerRepository: ICustomerRepository;

    constructor(customerRepository: ICustomerRepository) {
        this._customerRepository = customerRepository

    }
    public async execute(dto: UpdateWalletDto): Promise<any> {
        const customer = await this.customerRepository.findByIdOrThrow(new CustomerId(dto.customerId));
        const datesOfCharge = dto.datesOfCharge.map(dateOfCharge => new DateOfCharge(new Day(dateOfCharge.dayNumber), dateOfCharge.hour, dateOfCharge.minute))

        customer.updateWallet(dto.amountToCharge, dto.paymentMethodForCharging, dto.isEnabled, datesOfCharge);

        await this.customerRepository.save(customer);

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
}