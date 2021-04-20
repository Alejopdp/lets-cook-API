import { User } from "../../domain/user/User";
import { UserId } from "../../domain/user/UserId";
import { UserPassword } from "../../domain/user/UserPassword";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { GenerateNewPasswordDto } from "./generateNewPasswordDto";

export class GenerateNewPassword {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: GenerateNewPasswordDto): Promise<any> {
        const user: User | undefined = await this.userRepository.findByEmail(dto.email);

        if (!user) throw new Error("No se encontró al usuario");

        const newPassword: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        user.changePassword(newPassword);

        await this.userRepository.save(user);
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }
}
