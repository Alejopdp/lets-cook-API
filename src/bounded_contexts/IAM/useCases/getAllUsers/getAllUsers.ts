import { UseCase } from "../../../../core/domain/UseCase";
import { User } from "../../domain/user/User";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { GetAllUsersDto } from "./getAllUsersDto";
import { GetAllUsersPresenter } from "./getAllUsersPresenter";

type Response = any;

export class GetAllUsers implements UseCase<GetAllUsersDto, Promise<Response>> {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: GetAllUsersDto): Promise<Response> {
        const users: User[] = await this.userRepository.findAll();

        return GetAllUsersPresenter.present(users);
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }
}
