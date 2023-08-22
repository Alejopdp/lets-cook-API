import { CustomerId } from "../../domain/customer/CustomerId";
import { DateOfCharge } from "../../domain/customer/wallet/DateOfCharge";
import { Day } from "../../domain/day/Day";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CreateWalletDto } from "./createWalletDto";

export class CreateWallet {
    private _customerRepository: ICustomerRepository;

    constructor(repository1: ICustomerRepository) {
        this._customerRepository = repository1
    }
    public async execute(dto: CreateWalletDto): Promise<any> {
        const customer = await this.customerRepository.findByIdOrThrow(new CustomerId(dto.customerId));
        const datesOfCharge = dto.datesOfCharge.map(dateOfCharge => new DateOfCharge(new Day(dateOfCharge.dayNumber), dateOfCharge.hour, dateOfCharge.minute))

        customer.createWallet(dto.amountToCharge, dto.paymentMethodForChargingId, datesOfCharge);

        await this._customerRepository.save(customer);
    }


    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}