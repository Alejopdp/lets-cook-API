import { CustomerId } from "../../domain/customer/CustomerId";
import { DateOfCharge } from "../../domain/customer/wallet/DateOfCharge";
import { Day } from "../../domain/day/Day";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateWalletDto } from "./updateWalletDto";

export class UpateWallet {
    private _customerRepository: ICustomerRepository;

    constructor(customerRepository: ICustomerRepository) {
        this._customerRepository = customerRepository

    }
    public async execute(dto: UpdateWalletDto): Promise<any> {
        const customer = await this.customerRepository.findByIdOrThrow(new CustomerId(dto.customerId));
        const datesOfCharge = dto.datesOfCharge.map(dateOfCharge => new DateOfCharge(new Day(dateOfCharge.dayNumber), dateOfCharge.hour, dateOfCharge.minute))

        customer.updateWallet(dto.amountToCharge, dto.paymentMethodForChargingId, dto.isEnabled, datesOfCharge);
    }



    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}