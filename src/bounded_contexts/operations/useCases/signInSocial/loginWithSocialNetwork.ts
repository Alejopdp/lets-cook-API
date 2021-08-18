import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { Customer } from "../../domain/customer/Customer";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { LoginWithSocialMediaDto } from "./loginWithSocialMediaDto";
import { LoginWithEmailErrors, invalidLoginArguments, inactiveUser } from "./loginWithEmailErrors";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";
import { initializeApp, credential } from "firebase-admin";
// var admin = require("firebase-admin");
const firebaseAdminConfig = require("../../../../../firebase-admin.json");
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { logger } from "../../../../../config";

type Response = Either<Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser>, any>;

const app = initializeApp({
    credential: credential.cert(firebaseAdminConfig),
});

export class LoginWithSocialNetwork implements UseCase<LoginWithSocialMediaDto, Promise<Response>> {
    private _customerRepository: ICustomerRepository;
    private _tokenService: ITokenService;
    private _paymentService: IPaymentService;

    constructor(userRepository: ICustomerRepository, tokenService: ITokenService, paymentService: IPaymentService) {
        this._customerRepository = userRepository;
        this._tokenService = tokenService;
        this._paymentService = paymentService;
    }

    public async execute(dto: LoginWithSocialMediaDto): Promise<Response> {
        var user: any = null;
        var userEmail: string = "";
        const decodedToken = await app.auth().verifyIdToken(dto.idToken);
        user = await app.auth().getUser(decodedToken.uid);
        userEmail = user.email || user.providerData[0]?.email || "";

        console.log("DECODED TOKEN: ", decodedToken);
        console.log("USER: ", user);

        var customer: Customer | undefined = await this.customerRepository.findByEmail(userEmail);

        if (!!!customer) {
            customer = Customer.create(userEmail, true, "", [], undefined, undefined, undefined, "active", undefined);
            const stripeCustomerId = await this.paymentService.createCustomer(customer.email);

            customer.stripeId = stripeCustomerId;
            await this.customerRepository.save(customer);
        }

        const tokenPayload = {
            email: customer.email,
            id: customer.id.value,
            // TO DO: Add more info
        };

        return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer));
    }

    /**
     * Getter userRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }
}
