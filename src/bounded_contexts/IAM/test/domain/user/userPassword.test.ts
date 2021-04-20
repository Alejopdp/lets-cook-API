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
            password = UserPassword.create("Pass1234", false);
        });

        describe("2 same UNHASHED password equality", function () {
            it("Should be equal", function () {
                expect(password.equals(UserPassword.create(password.value, password.isHashed))).to.be.equal(true);
            });
        });

        describe("2 distinct UNHASHED password equality", function () {
            var password1: UserPassword;
            var password2: UserPassword;

            before(function () {
                password1 = UserPassword.create("Pass1234", false);
                password2 = UserPassword.create("Pass12345", false);
            });

            it("Shouldn't be equal", function () {
                expect(password1.equals(password2)).to.be.equal(false);
            });
        });

        describe("2 distinct passwords, 1 UNHASHED the other HASHED", function () {
            before(function () {
                password = password.hashPassword();
            });

            it("Shouldn't be equal", function () {
                expect(password.equals(UserPassword.create("Paskdn39", false))).to.be.equal(false);
            });
        });

        describe("2 equal passwords, 1 UNHASHED the other HASHED", function () {
            var password: UserPassword;

            before(function () {
                password = UserPassword.create("Pass1234", false);
            });

            it("Should be equal", function () {
                expect(password.hashPassword().equals(password)).to.be.equal(true);
            });
        });

        describe("2 same HASHED password equality", function () {
            var hashedPassword: UserPassword;

            before(function () {
                hashedPassword = UserPassword.create("Pass1234", false).hashPassword();
            });

            it("Should throw", function () {
                expect(() => hashedPassword.equals(UserPassword.create(hashedPassword.value, hashedPassword.isHashed))).to.throw();
            });
        });

        describe("2 distinct HASHED password equality", function () {
            var password1: UserPassword;
            var password2: UserPassword;

            before(function () {
                password1 = UserPassword.create("Pass1234", false).hashPassword();
                password2 = UserPassword.create("Pass12345", false).hashPassword();
            });

            it("Shouldn't be equal", function () {
                expect(() => password1.equals(password2)).to.throw();
            });
        });
    });
});
