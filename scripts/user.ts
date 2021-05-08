import { User } from "../src/bounded_contexts/IAM/domain/user/User";
import { UserId } from "../src/bounded_contexts/IAM/domain/user/UserId";
import { UserName } from "../src/bounded_contexts/IAM/domain/user/UserName";
import { UserPassword } from "../src/bounded_contexts/IAM/domain/user/UserPassword";
import { adminRole } from "./role";

const name: UserName = new UserName("Admin", "1");
const name2: UserName = new UserName("Admin", "2");
const name3: UserName = new UserName("Admin", "3");
const name4: UserName = new UserName("Admin", "4");
const name5: UserName = new UserName("Admin", "5");
const name6: UserName = new UserName("Admin", "6");
const name7: UserName = new UserName("Admin", "7");
const name8: UserName = new UserName("Admin", "8");

var adminPassword: UserPassword = UserPassword.create("Pass1234", false).hashPassword();
var adminUser1Id: UserId = new UserId(1);
var adminUser2Id: UserId = new UserId(2);
var adminUser3Id: UserId = new UserId(3);
var adminUser4Id: UserId = new UserId(4);
var adminUser5Id: UserId = new UserId(5);
var adminUser6Id: UserId = new UserId(6);
var adminUser7Id: UserId = new UserId(7);
var adminUser8Id: UserId = new UserId(8);

export const adminUser1: User = User.create(
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

export const adminUser2: User = User.create(
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

export const adminUser3: User = User.create(
    name3,
    "admin3@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser3Id
);

export const adminUser4: User = User.create(
    name4,
    "admin4@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser4Id
);

export const adminUser5: User = User.create(
    name5,
    "admin5@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser5Id
);

export const adminUser6: User = User.create(
    name6,
    "admin6@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser6Id
);

export const adminUser7: User = User.create(
    name7,
    "admin7@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser7Id
);

export const adminUser8: User = User.create(
    name8,
    "admin8@gmail.com",
    true,
    adminRole,
    true,
    adminPassword,
    undefined,
    undefined,
    undefined,
    adminUser8Id
);
