// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { CustomerId } from "./CustomerId";
// import { PlanVariant } from "./PlanVariant/PlanVariant";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { logger } from "../../../../../config";
import { String } from "aws-sdk/clients/apigateway";

export class Customer extends Entity<Customer> {
    private _email: string;
    private _isEmailVerified: boolean;
    private _password?: UserPassword;
    private _state?: string;
    private _codeToRecoverPassword?: string;

    protected constructor(
        email: string,
        isEmailVerified: boolean,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        id?: CustomerId
    ) {
        super(id);
        this._email = email;
        this._isEmailVerified = isEmailVerified;
        this._password = password;
        this._state = state;
        this._codeToRecoverPassword = codeToRecoverPassword;
    }

    public static create(
        email: string,
        isEmailVerified: boolean,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        id?: CustomerId
    ): Customer {
        return new Customer(email, isEmailVerified, password, state, codeToRecoverPassword, id);
    }

    public changePassword(newPassword: UserPassword): void {
        this.password = newPassword;
        // this.state = false;
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
     * Getter password
     * @return {UserPassword}
     */
    public get password(): UserPassword | undefined {
        return this._password;
    }

    /**
     * Getter state
     * @return {string}
     */
    public get state(): string | undefined {
        return this._state;
    }

    /**
     * Getter state
     * @return {string}
     */
    public get codeToRecoverPassword(): string | undefined {
        return this._codeToRecoverPassword;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
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
     * Setter password
     * @param {UserPassword} value
     */
    public set password(value: UserPassword | undefined) {
        this._password = value;
    }

    /**
     * Setter state
     * @param {string} value
     */
    public set state(value: string | undefined) {
        this._state = value;
    }

    /**
     * Setter state
     * @param {string} value
     */
    public set codeToRecoverPassword(value: string | undefined) {
        this._codeToRecoverPassword = value;
    }
}
