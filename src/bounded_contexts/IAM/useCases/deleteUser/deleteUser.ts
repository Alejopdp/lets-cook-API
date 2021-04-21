import { UseCase } from "../../../../core/domain/UseCase";
import { UserId } from "../../domain/user/UserId";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { DeleteUserDto } from "./deleteUserDto";

type Response = any;

export class DeleteUser implements UseCase<DeleteUserDto, Promise<Response>> {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: DeleteUserDto): Promise<Response> {
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
