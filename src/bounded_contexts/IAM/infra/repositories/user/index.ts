import { Permission } from "../../../domain/permission/Permission";
import { Role } from "../../../domain/role/Role";
import { User } from "../../../domain/user/User";
import { UserId } from "../../../domain/user/UserId";
import { UserName } from "../../../domain/user/UserName";
import { UserPassword } from "../../../domain/user/UserPassword";
import { IUserRepository } from "./IUserRepository";
import { MockUserRepository } from "./mockUserRepository";
import { MongooseUserRepository } from "./mongooseUserRepository";

const mockDatabase: User[] = [];

const name: UserName = new UserName("Admin", "1");
const name2: UserName = new UserName("Admin", "2");
const adminRole: Role = new Role("Admin", [Permission.CREATE_ADMIN_USER]);

var adminPassword: UserPassword = UserPassword.create("Pass1234", false).hashPassword();

var adminUser1Id: UserId = new UserId(1);
var adminUser2Id: UserId = new UserId(2);

const adminUser1: User = User.create(
    name,
    "admin@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser1Id
);
const adminUser2: User = User.create(
    name2,
    "admin2@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser2Id
);

mockDatabase.push(adminUser1);
mockDatabase.push(adminUser2);

export const mockUserRepository: IUserRepository = new MockUserRepository([...mockDatabase]);
export const mongooseUserRepository: MongooseUserRepository = new MongooseUserRepository();
