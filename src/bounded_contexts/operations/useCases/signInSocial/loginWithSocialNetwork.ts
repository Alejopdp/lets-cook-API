import { logger } from "../../../../../config";
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
// import firebaseAdminConfig from '../../../../../firebase-admin.json';
const firebaseAdminConfig = require('../../../../../firebase-admin.json');

type Response = Either<Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser>, any>;

const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig)
  });

export class LoginWithSocialNetwork implements UseCase<LoginWithSocialMediaDto, Promise<Response>> {
    private _customerRepository: ICustomerRepository;
    private _tokenService: ITokenService;

    constructor(userRepository: ICustomerRepository, tokenService: ITokenService) {
        this._customerRepository = userRepository;
        this._tokenService = tokenService;
    }

    public async execute(dto: LoginWithSocialMediaDto): Promise<any> {
        console.log(dto.idToken)
        app
        .auth()
        .verifyIdToken(dto.idToken)
        .then(async (decodedToken: any) => {
            const uid = decodedToken.uid;
            console.log(decodedToken)
            const customer: Customer | undefined = await this.customerRepository.findByEmail(decodedToken.email);
            if(!customer) {
                console.log("Not Customer")
                const password: UserPassword = UserPassword.create(uid, false).hashPassword();
                const customer: Customer = Customer.create(decodedToken.email, decodedToken.email_verified, password, 'active', undefined);
                console.log("Customer: ", customer)
                await this.customerRepository.save(customer);
                
                const tokenPayload = {
                    email: decodedToken.email
                };
                console.log("TokenPayload: ",  tokenPayload)
                console.log(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), decodedToken.email))
                return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), decodedToken.email));
            } else {
                console.log("Customer")
                const incomingPassword: UserPassword = UserPassword.create(uid, false);
                if (!incomingPassword.equals(incomingPassword)) return isFailure(invalidLoginArguments());
                
                const tokenPayload = {
                    email: customer.email
                };
                console.log("TokenPayload: ", tokenPayload)
                console.log(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer.email))
                return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer.email));
            }
        }).catch((error: any) => {
            console.log(error)
        })
        // const customer: Customer | undefined = await this.customerRepository.findByEmail(dto.email);
        // // console.log("Customer: ",customer)
        // if (!customer) return isFailure(invalidLoginArguments());

        // if (!customer.state) return isFailure(inactiveUser());

        // const incomingPassword: UserPassword = UserPassword.create(dto.idToken, false);

        // if (!incomingPassword.equals(incomingPassword)) return isFailure(invalidLoginArguments());

        // const tokenPayload = {
        //     email: customer.email
        // };

        // return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer.email));
        return true;
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
}
