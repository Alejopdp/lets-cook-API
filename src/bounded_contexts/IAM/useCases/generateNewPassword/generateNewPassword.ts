import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { User } from "../../domain/user/User";
import { UserPassword } from "../../domain/user/UserPassword";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { GenerateNewPasswordDto } from "./generateNewPasswordDto";
import { GenerateNewPasswordErrors, invalidArguments } from "./generateNewPasswordErrors";

type Response = Either<Failure<GenerateNewPasswordErrors.InvalidArguments>, any>;

export class GenerateNewPassword implements UseCase<GenerateNewPasswordDto, Promise<Response>> {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: GenerateNewPasswordDto): Promise<Response> {
        const user: User | undefined = await this.userRepository.findByEmail(dto.email);

        if (!user) return isFailure(invalidArguments());

        const newPassword: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        user.changePassword(newPassword);

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
}
