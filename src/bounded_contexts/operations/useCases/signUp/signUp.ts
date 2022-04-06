import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { SignUpDto } from "./signUpDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { IMailingListService } from "../../application/mailingListService/IMailingListService";
import { Guard } from "../../../../core/logic/Guard";

export class SignUp {
    private _signUpRepository: ICustomerRepository;
    private _storageService: IStorageService;
    private _paymentService: IPaymentService;
    private _tokenService: ITokenService;
    private _mailingListService: IMailingListService;

    constructor(
        signUpRepository: ICustomerRepository,
        storageService: IStorageService,
        paymentService: IPaymentService,
        tokenService: ITokenService,
        mailingListService: IMailingListService
    ) {
        this._signUpRepository = signUpRepository;
        this._storageService = storageService;
        this._paymentService = paymentService;
        this._tokenService = tokenService;
        this._mailingListService = mailingListService;
    }

    public async execute(dto: SignUpDto): Promise<any> {
        Guard.againstAccents(dto.email, Locale.es);
        const customerInfo: Customer | undefined = await this.signUpRepository.findByEmail(dto.email);
        if (customerInfo) throw new Error("El usuario ya existe, por favor utiliza otro correo");

        const password: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        const customer: Customer = Customer.create(
            dto.email.toLowerCase(),
            dto.isEmailVerified,
            "",
            [],
            0,
            new Date(),
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

        // if (dto.isInCheckout)
        //     this.mailingListService.subscribeTo(process.env.MAILING_LIST_GROUP as string, customer.email, customer.getFullNameOrEmail());
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

    /**
     * Getter mailingListService
     * @return {IMailingListService}
     */
    public get mailingListService(): IMailingListService {
        return this._mailingListService;
    }
}
