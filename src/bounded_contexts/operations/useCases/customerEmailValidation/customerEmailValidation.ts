import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CustomerEmailValidationDto } from "./customerEmailValidationDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";

export class CustomerEmailValidation {
    private _customerEmailValidation: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(customerEmailValidationRepository: ICustomerRepository, storageService: IStorageService) {
        this._customerEmailValidation = customerEmailValidationRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CustomerEmailValidationDto): Promise<any> {
        const password: UserPassword = UserPassword.create("", false).hashPassword();
        const customer: Customer = Customer.create(dto.email, false, undefined, undefined, password, undefined, undefined);
        // console.log("CustomerUseCase: ", customer);
        let emailVerified: boolean = await this.customerEmailValidationRepository.isEmailVerified(customer.email);
        return emailVerified;
    }

    /**
     * Getter planRepository
     * @return {IShippingZoneRepository}
     */
    public get customerEmailValidationRepository(): ICustomerRepository {
        return this._customerEmailValidation;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
