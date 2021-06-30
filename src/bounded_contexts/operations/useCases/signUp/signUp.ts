import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { SignUpDto } from "./signUpDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { IPaymentService } from "../../application/paymentService/IPaymentService";

export class SignUp {
    private _signUpRepository: ICustomerRepository;
    private _storageService: IStorageService;
    private _paymentService: IPaymentService;

    constructor(signUpRepository: ICustomerRepository, storageService: IStorageService, paymentService: IPaymentService) {
        this._signUpRepository = signUpRepository;
        this._storageService = storageService;
        this._paymentService = paymentService;
    }

    public async execute(dto: SignUpDto): Promise<Customer> {
        const password: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        const customer: Customer = Customer.create(
            dto.email,
            dto.isEmailVerified,
            "",
            [],
            undefined,
            undefined,
            password,
            dto.state,
            undefined
        );
        const stripeCustomerId = await this.paymentService.createCustomer(customer.email);

        customer.stripeId = stripeCustomerId;
        await this.signUpRepository.save(customer);

        return customer;
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

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }
}
