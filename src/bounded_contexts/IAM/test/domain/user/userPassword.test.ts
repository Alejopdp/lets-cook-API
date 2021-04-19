import { expect } from "chai";
import { UserPassword } from "../../../domain/user/UserPassword";

describe("[DOMAIN] - UserPassword", function () {
    describe("UserPassword creation", function () {
        describe("Less than 8 characters", function () {
            var password: UserPassword;

            it("Should throw", function () {
                expect(() => UserPassword.create("ola", false)).to.throw();
            });
        });

        describe("Only 8 or more characters length", function () {
            var password: UserPassword;

            it("Should throw", function () {
                expect(() => UserPassword.create("asdasdsadsola", false)).to.throw();
            });
        });

        describe("8 or more characters with Upper case only", function () {
            var password: UserPassword;

            it("Should throw", function () {
                expect(() => UserPassword.create("Asdasdsadsola", false)).to.throw();
            });
        });

        describe("8 or more characters with a number digit only", function () {
            var password: UserPassword;

            it("Should throw", function () {
                expect(() => UserPassword.create("1sdasdsadsola", false)).to.throw();
            });
        });

        describe("8 or more characters with a number digit and upper case", function () {
            var password: UserPassword;

            before(function () {
                password = UserPassword.create("1sdasdsadsoSa", false);
            });

            it("Should not throw", function () {
                expect(password.value).to.be.equal("1sdasdsadsoSa");
                expect(password.isHashed).to.be.equal(false);
            });
        });
    });

    describe("User Password equality", function () {
        var password: UserPassword;

        before(function () {
            password = UserPassword.create("Pomelocuatro4", false);
        });

        describe("Unhashed password equality", function () {
            it("Should be equal", function () {
                expect(
                    password.equals(UserPassword.create(password.value, password.isHashed))
                ).to.be.equal(true);
            });
        });

        describe("Hashed password equality", function () {
            var hashedPassword: UserPassword;

            before(function () {
                hashedPassword = password.hashPassword();
            });

            it("Should be equal", function () {
                expect(
                    hashedPassword.equals(
                        UserPassword.create(hashedPassword.value, hashedPassword.isHashed)
                    )
                ).to.be.equal(true);
            });
        });
    });
});
