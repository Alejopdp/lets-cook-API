import { Role } from "../../../domain/role/Role";
import { Role as MongooseRole } from "../../../../../infraestructure/mongoose/models";
import { IRoleRepository } from "./IRoleRepository";
import mongoose from "mongoose";
import { roleMapper } from "../../../mappers";

export class MongooseRoleRepository implements IRoleRepository {
    constructor() {}

    public async save(role: Role): Promise<void> {
        const roleDb = roleMapper.toPersistence(role);
        const exists = await MongooseRole.exists({ title: role.title });

        if (exists) {
            await MongooseRole.updateOne({ title: role.title }, roleDb);
        } else {
            await MongooseRole.create(roleDb);
        }
    }

    public async findByTitle(roleTitle: string): Promise<Role | undefined> {
        const roleDb = await MongooseRole.findOne({ title: roleTitle });

        return roleDb ? roleMapper.toDomain(roleDb) : undefined;
    }

    public async findAll(): Promise<Role[]> {
        const rolesDb = await MongooseRole.find();

        return rolesDb.length > 0 ? rolesDb.map((role) => roleMapper.toDomain(role)) : [];
    }
}
