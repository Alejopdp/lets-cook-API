import { logger } from "../../../../../config";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { Customer } from "../../domain/customer/Customer";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { LoginWithEmailDto } from "./loginWithEmailDto";
import { LoginWithEmailErrors, invalidLoginArguments, inactiveUser, accountCreatedWithSocialMedia } from "./loginWithEmailErrors";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";
import { Locale } from "../../domain/locale/Locale";

type Response = Either<
    Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser | LoginWithEmailErrors.AccountCreatedWithSocialMedia>,
    any
>;

export class LoginWithEmail implements UseCase<LoginWithEmailDto, Promise<Response>> {
    private _customerRepository: ICustomerRepository;
    private _tokenService: ITokenService;

    constructor(userRepository: ICustomerRepository, tokenService: ITokenService) {
        this._customerRepository = userRepository;
        this._tokenService = tokenService;
    }

    public async execute(dto: LoginWithEmailDto): Promise<Response> {
        const customer: Customer | undefined = await this.customerRepository.findByEmail(dto.email);
        if (!customer) return isFailure(invalidLoginArguments());

        if (!customer.state) return isFailure(inactiveUser());

        if (!!!customer.password) return isFailure(accountCreatedWithSocialMedia());

        const incomingPassword: UserPassword = UserPassword.create(dto.password, false);

        if (!customer.password?.equals(incomingPassword)) return isFailure(invalidLoginArguments());

        const tokenPayload = {
            id: customer.id.value,
            email: customer.email,
        };

        console.log(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), customer, Locale.es));
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
}
