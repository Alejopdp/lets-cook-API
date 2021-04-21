import { logger } from "../../../../../config";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { ITokenService } from "../../application/tokenService/ITokenService";
import { User } from "../../domain/user/User";
import { UserPassword } from "../../domain/user/UserPassword";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { LoginWithEmailDto } from "./loginWithEmailDto";
import { LoginWithEmailErrors, invalidLoginArguments, inactiveUser } from "./loginWithEmailErrors";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";

type Response = Either<Failure<LoginWithEmailErrors.InvalidArguments | LoginWithEmailErrors.InactiveUser>, any>;

export class LoginWithEmail implements UseCase<LoginWithEmailDto, Promise<Response>> {
    private _userRepository: IUserRepository;
    private _tokenService: ITokenService;

    constructor(userRepository: IUserRepository, tokenService: ITokenService) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
    }

    public async execute(dto: LoginWithEmailDto): Promise<Response> {
        const user: User | undefined = await this.userRepository.findByEmail(dto.email);

        if (!user) return isFailure(invalidLoginArguments());

        if (!user.isActivated) return isFailure(inactiveUser());

        const incomingPassword: UserPassword = UserPassword.create(dto.password, false);

        if (!user.password?.equals(incomingPassword)) return isFailure(invalidLoginArguments());

        const tokenPayload = {
            firstName: user.name.firstName,
            lastName: user.name.lastName,
            roleTitle: user.role.title,
            permissions: user.role.permissions,
        };

        return isSuccess(LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), tokenPayload));
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}
