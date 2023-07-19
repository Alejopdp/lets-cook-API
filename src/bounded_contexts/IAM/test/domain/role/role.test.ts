// import { expect } from "chai";
// import { Permission } from "../../../domain/permission/Permission";
// import { Role } from "../../../domain/role/Role";

// describe("[DOMAIN] - Role tests", function () {
//     describe("Role creation", function () {
//         describe("Role without name", function () {
//             var role: Role;

//             it("Should throw", function () {
//                 expect(() => new Role("", [])).to.throw();
//             });
//         });
//     });

//     describe("Role permissions handling", function () {
//         var role: Role;

//         before(function () {
//             role = new Role("Test", [Permission.CREATE_PLAN, Permission.DELETE_PLAN]);
//         });

//         describe("Adding an existing permission", function () {
//             it("Should throw", function () {
//                 expect(() => role.addPermission(Permission.CREATE_PLAN));
//             });
//         });

//         describe("Adding a new permission", function () {
//             before(function () {
//                 role.addPermission(Permission.CREATE_RECIPE);
//             });

//             it("Should have the new permission", function () {
//                 expect(role.permissions.length).to.be.equal(3);
//                 expect(role.permissions[2]).to.be.equal(Permission.CREATE_RECIPE);
//             });
//         });

//         describe("Removing a permission", function () {
//             before(function () {
//                 role.removePermission(Permission.DELETE_PLAN);
//             });
//             it("Should remove the permission correctly", function () {
//                 expect(role.permissions[0]).to.be.equal(Permission.CREATE_PLAN);
//             });
//         });
//     });
// });
