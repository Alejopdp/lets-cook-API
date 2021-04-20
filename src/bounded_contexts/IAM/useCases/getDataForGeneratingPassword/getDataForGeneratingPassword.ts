import { Role } from "../../domain/role/Role";
import { User } from "../../domain/user/User";
import { IRoleRepository } from "../../infra/repositories/role/IRoleRepository";
import { IUserRepository } from "../../infra/repositories/user/IUserRepository";
import { GetDataForGeneratingPasswordDto } from "./getDataForGeneratingPasswordDto";

export class GetDataForGeneratingPassword {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public async execute(dto: GetDataForGeneratingPasswordDto): Promise<any> {
        const user: User | undefined = await this.userRepository.findByEmail(dto.email);

        if (!user) throw new Error("El usuario no existe mas");

        return { id: user.id.value, email: user.email };
    }

    /**
     * Getter userRepository
     * @return {IUserRepository}
     */
    public get userRepository(): IUserRepository {
        return this._userRepository;
    }
}
