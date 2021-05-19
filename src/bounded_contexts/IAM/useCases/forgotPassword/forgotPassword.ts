import { logger } from "../../../../../config";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { ITokenService } from "../../application/tokenService/ITokenService";
import { User } from "../../domain/user/User";
import { UserId } from "../../domain/user/UserId";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { ForgotPasswordDto } from "./forgotPasswordDto";
import { ForgotPasswordErrors, invalidArguments } from "./forgotPasswordErrors";

type Response = Either<Failure<ForgotPasswordErrors>, any>;

export class ForgotPassword implements UseCase<ForgotPasswordDto, Promise<Response>> {
    private _userRepository: IUserRepository;
    private _notificationService: INotificationService;
    private _tokenService: ITokenService;

    constructor(userRepository: IUserRepository, notificationService: INotificationService, tokenService: ITokenService) {
        this._userRepository = userRepository;
        this._notificationService = notificationService;
        this._tokenService = tokenService;
    }

    public async execute(dto: ForgotPasswordDto): Promise<Response> {
        const user: User | undefined = await this.userRepository.findByEmail(dto.email);

        if (!user) return isFailure(invalidArguments());

        user.requestChangePassword();

        const token = this.tokenService.passwordGenerationToken({ email: user.email, id: user.id.value });
        await this.notificationService.notifyNewBackOfficeUserToRecoverPassword(
            user.email,
            `${process.env.ADMIN_ORIGIN_URL}/nueva-contrasena?token=${token}`
        );

        await this.userRepository.save(user);

        return isSuccess(undefined);
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter tokenService
     * @return {ITokenService}
     */
    public get tokenService(): ITokenService {
        return this._tokenService;
    }
}
