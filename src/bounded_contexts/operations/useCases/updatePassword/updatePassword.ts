import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdatePasswordDto } from "./updatePasswordDto";
import { shippingRouter } from "../../infra/http/shipping";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";

export class UpdatePassword {
    private _updatePasswordRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(updatePasswordRepository: ICustomerRepository, storageService: IStorageService) {
        this._updatePasswordRepository = updatePasswordRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdatePasswordDto): Promise<void> {
        const customer: Customer | undefined = await this.updatePasswordRepository.findByEmail(dto.email);

        const newPassword: UserPassword = UserPassword.create(dto.newPassword, false).hashPassword();

        customer?.changePassword(newPassword);
        // const customer: Customer = Customer.create(dto.email, dto.isEmailVerified, password, dto.state, undefined);
        // console.log("UpdatePassword: ", customer);
        await this.updatePasswordRepository.save(customer);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get updatePasswordRepository(): ICustomerRepository {
        return this._updatePasswordRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
