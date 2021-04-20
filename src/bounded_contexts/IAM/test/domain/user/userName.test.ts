import { expect } from "chai";
import { UserName } from "../../../domain/user/UserName";

describe("[DOMAIN] - UserName test", function () {
    describe("UserName creation", function () {
        describe("Without last name", function () {
            var userName: UserName;

            before(function () {
                userName = new UserName("Alejo", "");
            });

            it("Should create it correctly", function () {
                expect(userName.firstName).to.be.equal("Alejo");
                expect(userName.getFullName()).to.be.equal("Alejo");
            });
        });

        describe("Wihtout first name", function () {
            var userName: UserName;

            it("Should throw", function () {
                expect(() => (userName = new UserName("", "Scotti"))).to.throw();
            });
        });

        describe("Good creation", function () {
            var userName: UserName;

            before(function () {
                userName = new UserName("Alejo", "Scotti");
            });

            it("Should create it correctly", function () {
                expect(userName.firstName).to.be.equal("Alejo");
                expect(userName.lastName).to.be.equal("Scotti");
                expect(userName.getFullName()).to.be.equal("Alejo Scotti");
            });
        });
    });
});
