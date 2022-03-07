import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { SendUpdateEmailEmailDto } from "./sendUpdateEmailEmailDto";

export class SendUpdateEmailEmail {
    private _customerRepository: ICustomerRepository;
    private _notificationService: INotificationService;
    private _tokenService: ITokenService;

    constructor(customerRepository: ICustomerRepository, notificationService: INotificationService, tokenService: ITokenService) {
        this._customerRepository = customerRepository;
        this._notificationService = notificationService;
        this._tokenService = tokenService;
    }
    public async execute(dto: SendUpdateEmailEmailDto): Promise<any> {
        const emailExists = await this.customerRepository.findByEmail(dto.newEmail);
        if (emailExists) throw new Error(`Ya existe un usuario registrado con el email: ${dto.newEmail}`);
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(customerId);
        const token: string = this.tokenService.getUpdateEmailToken({ email: dto.newEmail, customerId: customerId.value.toString() });
        const updateEmailUrl: string = `${process.env.CUSTOMER_ORIGIN_URL}/update-email?token=${token}`;

        await this.notificationService.sendUpdateEmailEmail(dto.newEmail, updateEmailUrl, dto.locale);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}
