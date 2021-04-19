import { IValueObject } from "../../../../core/domain/ValueObject";
import * as bcrypt from "bcryptjs";

export class UserPassword implements IValueObject<UserPassword> {
    private _value: string;
    private _isHashed: boolean;

    protected constructor(value: string, isHashed: boolean) {
        this._value = value;
        this._isHashed = isHashed;
    }

    public static create(plainTextPassword: string, isHashed: boolean): UserPassword {
        if (isHashed) return new UserPassword(plainTextPassword, isHashed);

        this.validatePassword(plainTextPassword);

        return new UserPassword(plainTextPassword, isHashed);
    }

    public equals(aUserPassword: UserPassword): boolean {
        return this.value === aUserPassword.value && this.isHashed === aUserPassword.isHashed;
    }

    protected static has8CharactersOrMore(plainTextPassword: string): boolean {
        return plainTextPassword.length >= 8;
    }

    protected static hasAtLeastOneUpperCaseCharacter(plainTextPassword: string): boolean {
        return plainTextPassword !== plainTextPassword.toLowerCase();
    }

    protected static hasAtLeastOneNumber(plainTextPassword: string): boolean {
        return /\d/.test(plainTextPassword);
    }

    private static validatePassword(plainTextPassword: string): void {
        if (
            !this.has8CharactersOrMore(plainTextPassword) ||
            !this.hasAtLeastOneNumber(plainTextPassword) ||
            !this.hasAtLeastOneUpperCaseCharacter(plainTextPassword)
        ) {
            throw new Error(
                "La contraseña debe tener al menos 8 caracteres, 1 letra mayúscula y 1 número"
            );
        }
    }

    public hashPassword(): UserPassword {
        if (this.isHashed) throw new Error("La contraseña ya ha sido encriptada");

        return UserPassword.create(bcrypt.hashSync(this.value), true);
    }

    public getHashedValue(): string {
        return this.isHashed ? this.value : this.hashPassword().value;
    }

    /**
     * Getter value
     * @return {string}
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Getter hashed
     * @return {boolean}
     */
    public get isHashed(): boolean {
        return this._isHashed;
    }
}
