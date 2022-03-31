import { User } from "../../../domain/user/User";
import { UserId } from "../../../domain/user/UserId";
import { IUserRepository } from "./IUserRepository";
import { User as MongooseUser } from "../../../../../infraestructure/mongoose/models";
import { userMapper } from "../../../mappers";

export class MongooseUserRepository implements IUserRepository {
    constructor() {}

    public async save(user: User): Promise<void> {
        const userDb = userMapper.toPersistence(user);

        if (await MongooseUser.exists({ _id: user.id.value })) {
            await MongooseUser.updateOne({ _id: user.id.value }, userDb);
        } else {
            await MongooseUser.create(userDb);
        }
    }

    public async findById(userId: UserId): Promise<User | undefined> {
        const userDb = await MongooseUser.findById(userId.value, { deletionFlag: false }).populate("roleId");

        return userDb ? userMapper.toDomain(userDb) : undefined;
    }

    public async findAll(): Promise<User[]> {
        const usersDb = await MongooseUser.find({ deletionFlag: false }).populate("roleId");

        return usersDb.length > 0 ? usersDb.map((u: any) => userMapper.toDomain(u)) : [];
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const userDb = await MongooseUser.findOne({ email: { $regex: `^${email}$`, $options: "i" }, deletionFlag: false }).populate(
            "roleId"
        );

        return !!userDb ? userMapper.toDomain(userDb) : undefined;
    }

    public async delete(userId: UserId): Promise<void> {
        await MongooseUser.updateOne({ _id: userId.value }, { deletionFlag: true });
    }
}
