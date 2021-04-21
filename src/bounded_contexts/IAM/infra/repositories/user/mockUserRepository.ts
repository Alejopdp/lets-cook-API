import { User } from "../../../domain/user/User";
import { UserId } from "../../../domain/user/UserId";
import { IUserRepository } from "./IUserRepository";

export class MockUserRepository implements IUserRepository {
    private _database: User[];

    constructor(database: User[]) {
        this._database = database;
    }

    public async save(user: User): Promise<void> {
        const filteredDatabase = this.database.filter((u) => u.id.equals(user.id));

        this.database = [...filteredDatabase, user];
    }

    public async findById(userId: UserId): Promise<User | undefined> {
        return this.database.find((u) => u.id.equals(userId));
    }

    public async findAll(): Promise<User[]> {
        return this.database;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.database.find((u) => u.email === email.toLowerCase());
    }

    public async delete(userId: UserId): Promise<void> {
        this.database = this.database.filter((u) => !u.id.equals(userId));
    }
    /**
     * Getter database
     * @return {User[]}
     */
    public get database(): User[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {User[]} value
     */
    public set database(value: User[]) {
        this._database = value;
    }
}
