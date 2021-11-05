import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { SignUpDto } from "./signUpDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";

export class SignUp {
    private _signUpRepository: ICustomerRepository;
    private _storageService: IStorageService;
    private _paymentService: IPaymentService;
    private _tokenService: ITokenService;

    constructor(
        signUpRepository: ICustomerRepository,
        storageService: IStorageService,
        paymentService: IPaymentService,
        tokenService: ITokenService
    ) {
        this._signUpRepository = signUpRepository;
        this._storageService = storageService;
        this._paymentService = paymentService;
        this._tokenService = tokenService;
    }

    public async execute(dto: SignUpDto): Promise<any> {
        const customerInfo: Customer | undefined = await this.signUpRepository.findByEmail(dto.email);
        if (customerInfo) throw new Error("El usuario ya existe, por favor utiliza otro correo");

        const password: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        const customer: Customer = Customer.create(
            dto.email,
            dto.isEmailVerified,
            "",
            [],
            0,
            undefined,
            undefined,
            password,
            dto.state,
            undefined,
            undefined
        );
        const stripeCustomerId = await this.paymentService.createCustomer(customer.email);

        customer.stripeId = stripeCustomerId;

        const tokenPayload = {
            id: customer.id.value,
            email: customer.email,
        };
        await this.signUpRepository.save(customer);

        return { customer, token: this.tokenService.signLoginToken(tokenPayload) };
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

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}
