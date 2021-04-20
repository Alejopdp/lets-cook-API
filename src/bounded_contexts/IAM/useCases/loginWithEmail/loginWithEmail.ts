import { logger } from "../../../../../config";
import { ITokenService } from "../../application/tokenService/ITokenService";
import { User } from "../../domain/user/User";
import { UserPassword } from "../../domain/user/UserPassword";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { LoginWithEmailDto } from "./loginWithEmailDto";
import { LoginWithEmailPresenter } from "./loginWithEmailPresenter";

export class LoginWithEmail {
    private _userRepository: IUserRepository;
    private _tokenService: ITokenService;

    constructor(userRepository: IUserRepository, tokenService: ITokenService) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
    }

    public async execute(dto: LoginWithEmailDto): Promise<any> {
        const user: User | undefined = await this.userRepository.findByEmail(dto.email);

        if (!user) throw new Error("Usuario y/o contraseña incorrecta");

        const incomingPassword: UserPassword = UserPassword.create(dto.password, false);

        if (!user.password?.equals(incomingPassword)) throw new Error("Usuario y/o contraseña incorrecta");

        const tokenPayload = {
            firstName: user.name.firstName,
            lastName: user.name.lastName,
            roleTitle: user.role.title,
            permissions: user.role.permissions,
        };

        return LoginWithEmailPresenter.present(this.tokenService.signLoginToken(tokenPayload), tokenPayload); // TO DO: Use env 4 token seed
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
