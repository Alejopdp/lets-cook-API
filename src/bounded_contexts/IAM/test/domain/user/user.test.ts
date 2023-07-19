// import { expect } from "chai";
// import { Permission } from "../../../domain/permission/Permission";
// import { Role } from "../../../domain/role/Role";
// import { User } from "../../../domain/user/User";
// import { UserName } from "../../../domain/user/UserName";
// import { UserPassword } from "../../../domain/user/UserPassword";

// describe("[DOMAIN] - User test", function () {
//     describe("User creation", function () {
//         describe("Missing email creation", function () {
//             var password: UserPassword;
//             var role: Role;
//             var userName: UserName;

//             before(function () {
//                 userName = new UserName("Alejo", "Scotti");
//                 password = UserPassword.create("Pass1234", false);
//                 role = new Role("Admin", [Permission.CREATE_ADMIN_USER, Permission.CREATE_PLAN]);
//             });

//             it("Should throw", function () {
//                 expect(() => User.create(userName, "", true, role, true, password));
//             });
//         });

//         describe("Right creation", function () {
//             var user: User;
//             var password: UserPassword;
//             var role: Role;
//             var userName: UserName;

//             before(function () {
//                 userName = new UserName("Alejo", "Scotti");
//                 password = UserPassword.create("Pass1234", false);
//                 role = new Role("Admin", [Permission.CREATE_ADMIN_USER, Permission.CREATE_PLAN]);
//                 user = User.create(userName, "alejoscotti@gmail.com", false, role, true, password);
//             });

//             it("Should have it name correctly created", function () {
//                 expect(user.name.getFullName()).to.be.equal("Alejo Scotti");
//             });

//             it("Should have it email correctly created", function () {
//                 expect(user.email).to.be.equal("alejoscotti@gmail.com");
//             });

//             it("Should have it password correctly created", function () {
//                 expect(user.password!.value).to.be.equal("Pass1234");
//             });

//             it("Should have it role correctly created", function () {
//                 expect(user.role.title).to.be.equal("Admin");
//                 expect(
//                     user.role.permissions.every(
//                         (permission) => permission === Permission.CREATE_ADMIN_USER || permission === Permission.CREATE_PLAN
//                     )
//                 );
//             });
//         });
//     });
// });
