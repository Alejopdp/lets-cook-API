import { IValueObject } from "../../../../core/domain/ValueObject";
import { Guard } from "../../../../core/logic/Guard";

export class UserName implements IValueObject<UserName> {
    private _firstName: string;
    private _lastName: string;

    constructor(firstName: string, lastName: string) {
        const guardResult = Guard.againstNullOrUndefinedOrEmpty(firstName, "Primer nombre");

        if (!guardResult.succeeded) throw new Error(guardResult.message);

        this._firstName = firstName;
        this._lastName = lastName;
    }

    public equals(aUserName: UserName): boolean {
        return this.firstName === aUserName.firstName && this.lastName === aUserName.lastName;
    }

    public getFullName(): string {
        return this.lastName ? this.firstName + " " + this.lastName : this.firstName;
    }

    /**
     * Getter firstName
     * @return {string}
     */
    public get firstName(): string {
        return this._firstName;
    }

    /**
     * Getter lastName
     * @return {string}
     */
    public get lastName(): string {
        return this._lastName;
    }

    /**
     * Setter firstName
     * @param {string} value
     */
    public set firstName(value: string) {
        this._firstName = value;
    }

    /**
     * Setter lastName
     * @param {string} value
     */
    public set lastName(value: string) {
        this._lastName = value;
    }
}
