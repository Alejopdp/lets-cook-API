import { expect } from "chai";
import { Permission } from "../../../domain/permission/Permission";
import { Role } from "../../../domain/role/Role";
import { User } from "../../../domain/user/User";
import { UserPassword } from "../../../domain/user/UserPassword";

describe("[DOMAIN] - User test", function () {
    describe("User creation", function () {
        describe("Missing name creation", function () {
            var password: UserPassword;
            var role: Role;

            before(function () {
                password = UserPassword.create("Pass1234", false);
                role = new Role("Admin", [Permission.CREATE_ADMIN_USER, Permission.CREATE_PLAN]);
            });

            it("Should throw", function () {
                expect(() => User.create("", "alejoscotti@gmail.com", true, password, role));
            });
        });

        describe("Missing email creation", function () {
            var password: UserPassword;
            var role: Role;

            before(function () {
                password = UserPassword.create("Pass1234", false);
                role = new Role("Admin", [Permission.CREATE_ADMIN_USER, Permission.CREATE_PLAN]);
            });

            it("Should throw", function () {
                expect(() => User.create("Alejo", "", true, password, role));
            });
        });

        describe("Right creation", function () {
            var user: User;
            var password: UserPassword;
            var role: Role;

            before(function () {
                password = UserPassword.create("Pass1234", false);
                role = new Role("Admin", [Permission.CREATE_ADMIN_USER, Permission.CREATE_PLAN]);
                user = User.create("Alejo", "alejoscotti@gmail.com", false, password, role);
            });

            it("Should have it name correctly created", function () {
                expect(user.name).to.be.equal("Alejo");
            });

            it("Should have it email correctly created", function () {
                expect(user.email).to.be.equal("alejoscotti@gmail.com");
            });

            it("Should have it password correctly created", function () {
                expect(user.password.value).to.be.equal("Pass1234");
            });

            it("Should have it role correctly created", function () {
                expect(user.role.title).to.be.equal("Admin");
                expect(
                    user.role.permissions.every(
                        (permission) =>
                            permission === Permission.CREATE_ADMIN_USER ||
                            permission === Permission.CREATE_PLAN
                    )
                );
            });
        });
    });
});
