import { logger } from "../../../../../config";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { ITokenService } from "../../application/tokenService/ITokenService";
import { Role } from "../../domain/role/Role";
import { User } from "../../domain/user/User";
import { UserName } from "../../domain/user/UserName";
import { IRoleRepository } from "../../infra/repositories/role/IRoleRepository";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { CreateUserAsAdminDto } from "./createUserAsAdminDto";

export class CreateUserAsAdmin {
    private _userRepository: IUserRepository;
    private _roleRepository: IRoleRepository;
    private _notificationService: INotificationService;
    private _tokenService: ITokenService;

    constructor(
        userRepository: IUserRepository,
        roleRepository: IRoleRepository,
        notificationService: INotificationService,
        tokenService: ITokenService
    ) {
        this._userRepository = userRepository;
        this._roleRepository = roleRepository;
        this._notificationService = notificationService;
        this._tokenService = tokenService;
    }

    public async execute(dto: CreateUserAsAdminDto): Promise<void> {
        const userName: UserName = new UserName(dto.firstName, dto.lastName);
        const userRole: Role | undefined = await this.roleRepository.findByTitle(dto.roleTitle);

        if (!userRole) throw new Error(`El rol ${dto.roleTitle} no existe para asignarselo a un usuario`);

        const user: User = User.create(userName, dto.email, true, userRole, false);

        await this.userRepository.save(user);
        await this.notificationService.notifyNewBackOfficeUserToGeneratePassword(
            user.email,
            `${process.env.ADMIN_ORIGIN_URL}/nueva-contrasena?token=${this.tokenService.passwordGenerationToken({ email: user.email })}`
        );
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
