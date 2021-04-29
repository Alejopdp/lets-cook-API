import { User } from "../../domain/user/User";
import { UserId } from "../../domain/user/UserId";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { DeleteUserDto } from "./deleteUserDto";

export class DeleteUser {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: DeleteUserDto): Promise<void> {
        const userId: UserId = new UserId(dto.id);

        await this.userRepository.delete(userId);
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }
}
