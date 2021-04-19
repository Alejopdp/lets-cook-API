import { Role } from "../../domain/role/Role";
import { IRoleRepository } from "../../infra/repositories/role/IRoleRepository";
import { CreateRoleDto } from "./createRoleDto";

export class CreateRole {
    private _roleRepository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
        this._roleRepository = roleRepository;
    }

    public async execute(dto: CreateRoleDto): Promise<void> {
        const role: Role = new Role(dto.title, dto.permissions);

        await this.roleRepository.save(role);
    }

    /**
     * Getter roleRepository
     * @return {IRoleRepository}
     */
    public get roleRepository(): IRoleRepository {
        return this._roleRepository;
    }

    /**
     * Setter roleRepository
     * @param {IRoleRepository} value
     */
    public set roleRepository(value: IRoleRepository) {
        this._roleRepository = value;
    }
}
