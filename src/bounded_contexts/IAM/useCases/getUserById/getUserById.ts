import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { User } from "../../domain/user/User";
import { UserId } from "../../domain/user/UserId";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { GetUserByIdDto } from "./getUserByIdDto";
import { GetUserByIdErrors, invalidArguments } from "./getUserByIdErrors";
import { GetUserByIdPresenter } from "./getUserByIdPresenter";

type Response = Either<Failure<GetUserByIdErrors>, any>;

export class GetUserById implements UseCase<GetUserByIdDto, Promise<Response>> {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: GetUserByIdDto): Promise<Response> {
        const userId: UserId = new UserId(dto.id);
        const user: User | undefined = await this.userRepository.findById(userId);

        if (!user) return isFailure(invalidArguments());

        return isSuccess(GetUserByIdPresenter.present(user));
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }
}
