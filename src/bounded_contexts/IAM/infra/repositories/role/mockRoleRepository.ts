import { Role } from "../../../domain/role/Role";
import { IRoleRepository } from "./IRoleRepository";

export class MockRoleRepository implements IRoleRepository {
    private _database: Role[];

    constructor(database: Role[]) {
        this._database = database;
    }

    public async save(role: Role): Promise<void> {
        const filteredDatabase = this.database.filter((r) => r.title !== role.title);

        this.database = [...filteredDatabase, role];
    }

    public async findByTitle(roleTitle: string): Promise<Role | undefined> {
        return this.database.find((role) => role.title === roleTitle);
    }

    public async findAll(): Promise<Role[]> {
        return this.database;
    }

    /**
     * Getter database
     * @return {Role[]}
     */
    public get database(): Role[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Role[]} value
     */
    public set database(value: Role[]) {
        this._database = value;
    }
}
