import { logger } from "../../../../../config";
import { Role } from "../../domain/role/Role";
import { User } from "../../domain/user/User";
import { UserName } from "../../domain/user/UserName";
import { UserPassword } from "../../domain/user/UserPassword";
import { IRoleRepository } from "../../infra/repositories/role/IRoleRepository";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { CreateUserAsAdminDto } from "./createUserAsAdminDto";

export class CreateUserAsAdmin {
    private _userRepository: IUserRepository;
    private _roleRepository: IRoleRepository;

    constructor(userRepository: IUserRepository, roleRepository: IRoleRepository) {
        this._userRepository = userRepository;
        this._roleRepository = roleRepository;
    }

    public async execute(dto: CreateUserAsAdminDto): Promise<void> {
        const userName: UserName = new UserName(dto.firstName, dto.lastName);
        const userRole: Role | undefined = await this.roleRepository.findByTitle(dto.roleTitle);

        if (!userRole) throw new Error(`El rol ${dto.roleTitle} no existe para asignarselo a un usuario`);

        const user: User = User.create(userName, dto.email, true, userRole, false);

        await this.userRepository.save(user);
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
