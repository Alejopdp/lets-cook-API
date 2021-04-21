import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { Role } from "../../domain/role/Role";
import { User } from "../../domain/user/User";
import { UserId } from "../../domain/user/UserId";
import { UserName } from "../../domain/user/UserName";
import { IRoleRepository } from "../../infra/repositories/role/IRoleRepository";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { UpdateUserDto } from "./updateUserDto";
import { UpdateUserErrors, invalidArguments, invalidUser } from "./updateUserErrors";

type Response = Either<Failure<UpdateUserErrors>, any>;

export class UpdateUser implements UseCase<UpdateUserDto, Promise<Response>> {
    private _userRepository: IUserRepository;
    private _roleRepository: IRoleRepository;

    constructor(userRepository: IUserRepository, roleRepository: IRoleRepository) {
        this._userRepository = userRepository;
        this._roleRepository = roleRepository;
    }

    public async execute(dto: UpdateUserDto): Promise<Response> {
        const userId: UserId = new UserId(dto.id);
        const user: User | undefined = await this.userRepository.findById(userId);

        if (!user) return isFailure(invalidUser());

        if (dto.firstName !== user.name.firstName) user.name = new UserName(dto.firstName, user.name.lastName);

        if (dto.lastName !== user.name.lastName) user.name = new UserName(user.name.firstName, dto.lastName);

        if (dto.roleTitle !== user.role.title) {
            const newRole: Role | undefined = await this.roleRepository.findByTitle(dto.roleTitle);

            if (!newRole) return isFailure(invalidArguments());

            user.role = newRole;
        }

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
     * Getter roleRepository
     * @return {IRoleRepository}
     */
    public get roleRepository(): IRoleRepository {
        return this._roleRepository;
    }
}
