import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isSuccess } from "../../../../core/logic/Result";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { LoginWithSocialMediaDto } from "./loginWithSocialMediaDto";
import { LoginWithEmailErrors } from "./loginWithEmailErrors";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";
import { initializeApp, credential } from "firebase-admin";
// var admin = require("firebase-admin");
const firebaseAdminConfig = require("../../../../firebase-admin.json");
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { IMailingListService } from "../../application/mailingListService/IMailingListService";
import { Locale } from "../../domain/locale/Locale";
import { Guard } from "../../../../core/logic/Guard";
import { PersonalInfo } from "../../domain/customer/personalInfo/PersonalInfo";

type Response = Either<Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser>, any>;

const app = initializeApp({
    credential: credential.cert(firebaseAdminConfig),
});

export class LoginWithSocialNetwork implements UseCase<LoginWithSocialMediaDto, Promise<Response>> {
    private _customerRepository: ICustomerRepository;
    private _tokenService: ITokenService;
    private _paymentService: IPaymentService;
    private _mailingListService: IMailingListService;

    constructor(
        userRepository: ICustomerRepository,
        tokenService: ITokenService,
        paymentService: IPaymentService,
        mailingListService: IMailingListService
    ) {
        this._customerRepository = userRepository;
        this._tokenService = tokenService;
        this._paymentService = paymentService;
        this._mailingListService = mailingListService;
    }

    public async execute(dto: LoginWithSocialMediaDto): Promise<Response> {
        var user: any = null;
        var userEmail: string = "";
        const decodedToken = await app.auth().verifyIdToken(dto.idToken);
        user = await app.auth().getUser(decodedToken.uid);
        userEmail = user.email || user.providerData[0]?.email || dto.email || "";

        var customer: Customer | undefined = await this.customerRepository.findByEmail(userEmail);

        if (!!!customer) {
            Guard.againstAccents(dto.email, Locale.es);
            const newCustomerDisplayName: string = user.displayName;
            customer = Customer.create(userEmail, true, "", [], 0, new Date(), undefined, undefined, undefined, "active", undefined);
            const firstName: string = newCustomerDisplayName?.split(" ")?.[0] ?? "";
            const lastName = newCustomerDisplayName?.split(" ")?.slice(1)?.join() ?? "";
            const newCustomerPersonalInfo = new PersonalInfo(firstName, lastName, user.phoneNumber ?? "");
            customer["personalInfo"] = newCustomerPersonalInfo;
            const stripeCustomerId = await this.paymentService.createCustomer(customer.email);

            customer.stripeId = stripeCustomerId;

            // if (dto.isInCheckout)
            //     this.mailingListService.subscribeTo(
            //         process.env.MAILING_LIST_GROUP as string,
            //         customer.email,
            //         customer.getFullNameOrEmail()
            //     );
            await this.customerRepository.save(customer);
        }

        const tokenPayload = {
            email: customer.email,
            id: customer.id.value,
            // TO DO: Add more info
        };

        return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer, Locale.es));
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

    /**
     * Getter mailingListService
     * @return {IMailingListService}
     */
    public get mailingListService(): IMailingListService {
        return this._mailingListService;
    }
}
