import { Role } from "../../domain/role/Role";
import { IRoleRepository } from "../../infra/repositories/role/IRoleRepository";
import { GetRoleListPresenter } from "./getRoleListPresenter";

export class GetRoleList {
    private _roleRepository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
        this._roleRepository = roleRepository;
    }

    public async execute(): Promise<void> {
        const roles: Role[] = await this.roleRepository.findAll();

        return GetRoleListPresenter.present(roles);
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
