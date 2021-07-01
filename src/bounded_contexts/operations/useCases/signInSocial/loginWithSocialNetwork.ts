import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { Customer } from "../../domain/customer/Customer"
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { LoginWithSocialMediaDto } from "./loginWithSocialMediaDto";
import { LoginWithEmailErrors, invalidLoginArguments, inactiveUser } from "./loginWithEmailErrors";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";
var admin = require("firebase-admin");
const firebaseAdminConfig = require('../../../../../firebase-admin.json');
import { IPaymentService } from "../../application/paymentService/IPaymentService";

type Response = Either<Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser>, any>;

const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig)
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
        let user: any = null;
        await app
        .auth()
        .verifyIdToken(dto.idToken)
        .then(async (decodedToken: any) => {
            const uid = decodedToken.uid;
            user = decodedToken;
        }).catch(async (error: any) => {
            console.log(error)
            // return isFailure(invalidLoginArguments())
        })

        const customer: Customer | undefined = await this.customerRepository.findByEmail(user.email);

        if(!customer) {
            const customer: Customer = Customer.create(user.email, user.email_verified, '', [], undefined, undefined, undefined, 'active', undefined);
            const stripeCustomerId = await this.paymentService.createCustomer(customer.email);

            customer.stripeId = stripeCustomerId;
            console.log("Customer: ", customer)
            await this.customerRepository.save(customer);
            
            const tokenPayload = {
                email: user.email
            };

            return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), user.email));
        } else {            
            const tokenPayload = {
                email: customer.email
            };

            return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer.email));
        }
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