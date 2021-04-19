import { Role } from "../../../domain/role/Role";

export interface IRoleRepository {
    save(role: Role): Promise<void>;
    findByTitle(roleTitle: string): Promise<Role | undefined>;
    findAll(): Promise<Role[]>;
}
