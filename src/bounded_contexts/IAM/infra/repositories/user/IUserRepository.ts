import { User } from "../../../domain/user/User";
import { UserId } from "../../../domain/user/UserId";

export interface IUserRepository {
    save(user: User): Promise<void>;
    findById(userId: UserId): Promise<User | undefined>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | undefined>;
}
