import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { Role } from "../role/Role";
import { UserId } from "./UserId";
import { UserName } from "./UserName";
import { UserPassword } from "./UserPassword";

export class User extends Entity<User> {
    private _name: UserName;
    private _email: string;
    private _isEmailVerified: boolean;
    private _role: Role;
    private _password?: UserPassword;
    private _isActivated: boolean;
    private _emailVerificationCode?: number;
    private _resetPasswordCode?: number;
    private _resetPasswordExpires?: Date;

    protected constructor(
        name: UserName,
        email: string,
        isEmailVerified: boolean,
        role: Role,
        isActivated: boolean,
        password?: UserPassword,
        emailVerificationCode?: number,
        resetPasswordCode?: number,
        resetPasswordExpires?: Date,
        id?: UserId
    ) {
        super(id);
        this._name = name;
        this._email = email;
        this._isEmailVerified = isEmailVerified;
        this._emailVerificationCode = emailVerificationCode;
        this._password = password;
        this._isActivated = isActivated;
        this._role = role;
        this._resetPasswordCode = resetPasswordCode;
        this._resetPasswordExpires = resetPasswordExpires;
    }

    public static create(
        name: UserName,
        email: string,
        isEmailVerified: boolean,
        role: Role,
        isActivated: boolean,
        password?: UserPassword,
        emailVerificationCode?: number,
        resetPasswordCode?: number,
        resetPasswordExpires?: Date,
        id?: UserId
    ): User {
        const guardedProps = [
            { argument: name, argumentName: "Nombre completo" },
            { argument: email, argumentName: "Correo electrónico" },
            { argument: role, argumentName: "Rol" },
        ];

        const guardResult = Guard.againstNullOrUndefinedOrEmptyBulk(guardedProps);

        if (!guardResult.succeeded) {
            throw new Error(guardResult.message);
        }

        if (!password && isActivated)
            throw new Error("No es posible activar un usuario sin contraseña");
        return new User(
            name,
            email,
            isEmailVerified,
            role,
            isActivated,
            password,
            emailVerificationCode,
            resetPasswordCode,
            resetPasswordExpires,
            id
        );
    }

    public changeRole(newRole: Role): void {
        this.role = newRole;
    }

    public changePassword(aPassword: UserPassword): void {
        this.password = aPassword;
    }

    /**
     * Getter name
     * @return {UserName}
     */
    public get name(): UserName {
        return this._name;
    }

    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Getter isEmailVerified
     * @return {boolean}
     */
    public get isEmailVerified(): boolean {
        return this._isEmailVerified;
    }

    /**
     * Getter emailVerificationCode
     * @return {number | undefined}
     */
    public get emailVerificationCode(): number | undefined {
        return this._emailVerificationCode;
    }

    /**
     * Getter password
     * @return {UserPassword | undefined}
     */
    public get password(): UserPassword | undefined {
        return this._password;
    }

    /**
     * Getter role
     * @return {Role}
     */
    public get role(): Role {
        return this._role;
    }

    /**
     * Getter resetPasswordCode
     * @return {number | undefined}
     */
    public get resetPasswordCode(): number | undefined {
        return this._resetPasswordCode;
    }

    /**
     * Getter resetPasswordExpires
     * @return {Date | undefined}
     */
    public get resetPasswordExpires(): Date | undefined {
        return this._resetPasswordExpires;
    }

    /**
     * Getter isActivated
     * @return {boolean}
     */
    public get isActivated(): boolean {
        return this._isActivated;
    }

    /**
     * Setter name
     * @param {UserName} value
     */
    public set name(value: UserName) {
        const guardResult = Guard.againstNullOrUndefined(value, "Nombre completo");
        if (!guardResult.succeeded) throw new Error(guardResult.message);

        this._name = value;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        const guardResult = Guard.againstNullOrUndefined(value, "Correo electrónico");
        if (!guardResult.succeeded) throw new Error(guardResult.message);

        this._email = value;
    }

    /**
     * Setter isEmailVerified
     * @param {boolean} value
     */
    public set isEmailVerified(value: boolean) {
        this._isEmailVerified = value;
    }

    /**
     * Setter emailVerificationCode
     * @param {number | undefined} value
     */
    public set emailVerificationCode(value: number | undefined) {
        this._emailVerificationCode = value;
    }

    /**
     * Setter password
     * @param {UserPassword | undefined} value
     */
    public set password(value: UserPassword | undefined) {
        this._password = value;
    }

    /**
     * Setter resetPasswordCode
     * @param {number | undefined} value
     */
    public set resetPasswordCode(value: number | undefined) {
        this._resetPasswordCode = value;
    }

    /**
     * Setter resetPasswordExpires
     * @param {Date | undefined} value
     */
    public set resetPasswordExpires(value: Date | undefined) {
        this._resetPasswordExpires = value;
    }

    /**
     * Setter role
     * @param {Role} value
     */
    public set role(value: Role) {
        const guardResult = Guard.againstNullOrUndefined(value, "Rol");
        if (!guardResult.succeeded) throw new Error(guardResult.message);

        this._role = value;
    }

    /**
     * Setter isActivated
     * @param {boolean} value
     */
    public set isActivated(value: boolean) {
        this._isActivated = value;
    }
}
