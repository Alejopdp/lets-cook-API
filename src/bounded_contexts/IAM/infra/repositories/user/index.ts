import { Permission } from "../../../domain/permission/Permission";
import { Role } from "../../../domain/role/Role";
import { User } from "../../../domain/user/User";
import { UserName } from "../../../domain/user/UserName";
import { UserPassword } from "../../../domain/user/UserPassword";
import { IUserRepository } from "./IUserRepository";
import { MockUserRepository } from "./mockUserRepository";

const mockDatabase: User[] = [];

const name: UserName = new UserName("Admin", "1");
const name2: UserName = new UserName("Admin", "2");
const adminRole: Role = new Role("Admin", [Permission.CREATE_ADMIN_USER]);

var adminPassword: UserPassword = UserPassword.create("Pass1234", false).hashPassword();

const adminUser1: User = User.create(name, "admin@gmail.com", true, adminRole, true, adminPassword);
const adminUser2: User = User.create(name2, "admin2@gmail.com", true, adminRole, true, adminPassword);

mockDatabase.push(adminUser1);
mockDatabase.push(adminUser2);

export const mockUserRepository: IUserRepository = new MockUserRepository([...mockDatabase]);
