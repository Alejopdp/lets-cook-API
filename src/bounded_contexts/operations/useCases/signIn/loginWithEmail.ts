import { logger } from "../../../../../config";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { ITokenService } from "../../../IAM/application/tokenService/ITokenService";
import { Customer } from "../../domain/customer/Customer";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { LoginWithEmailDto } from "./loginWithEmailDto";
import { LoginWithEmailErrors, invalidLoginArguments, inactiveUser } from "./loginWithEmailErrors";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";

type Response = Either<Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser>, any>;

export class LoginWithEmail implements UseCase<LoginWithEmailDto, Promise<Response>> {
    private _customerRepository: ICustomerRepository;
    private _tokenService: ITokenService;

    constructor(userRepository: ICustomerRepository, tokenService: ITokenService) {
        this._customerRepository = userRepository;
        this._tokenService = tokenService;
    }

    public async execute(dto: LoginWithEmailDto): Promise<Response> {
        const customer: Customer | undefined = await this.customerRepository.findByEmail(dto.email);
        // console.log("Customer: ",customer)
        if (!customer) return isFailure(invalidLoginArguments());

        if (!customer.state) return isFailure(inactiveUser());

        const incomingPassword: UserPassword = UserPassword.create(dto.password, false);

        if (!incomingPassword.equals(incomingPassword)) return isFailure(invalidLoginArguments());

        const tokenPayload = {
            email: customer.email,
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
}
