import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { SignUpDto } from "./signUpDto";
import { shippingRouter } from "../../infra/http/shipping";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";

export class SignUp {
    private _signUpRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(signUpRepository: ICustomerRepository, storageService: IStorageService) {
        this._signUpRepository = signUpRepository;
        this._storageService = storageService;
    }

    public async execute(dto: SignUpDto): Promise<void> {
        const password: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        const customer: Customer = Customer.create(dto.email, dto.isEmailVerified, undefined, undefined, password, dto.state, undefined);
        // console.log("SignUpUseCase: ", customer);
        await this.signUpRepository.save(customer);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get signUpRepository(): ICustomerRepository {
        return this._signUpRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
