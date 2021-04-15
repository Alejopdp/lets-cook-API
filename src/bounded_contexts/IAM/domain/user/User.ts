export class User {
    private _id: string | number;
    private _name: string;
    private _email: string;
    private _phoneNumber: string;
    private _isEmailVerified: boolean;
    private _password: string;
    private _emailVerificationCode: number;
    private _resetPasswordCode?: number;
    private _resetPasswordExpires?: Date;

    constructor(
        id: string,
        name: string,
        email: string,
        isEmailVerified: boolean,
        emailVerificationCode: number,
        password: string,
        phoneNumber: string,
        resetPasswordCode?: number,
        resetPasswordExpires?: Date
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._isEmailVerified = isEmailVerified;
        this._emailVerificationCode = emailVerificationCode;
        this._password = password;
        this._phoneNumber = phoneNumber;
        this._resetPasswordCode = resetPasswordCode;
        this._resetPasswordExpires = resetPasswordExpires;
    }

    /**
     * Getter id
     * @return {string | number}
     */
    public get id(): string | number {
        return this._id;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
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
     * @return {number}
     */
    public get emailVerificationCode(): number {
        return this._emailVerificationCode;
    }

    /**
     * Getter password
     * @return {string}
     */
    public get password(): string {
        return this._password;
    }

    /**
     * Getter phoneNumber
     * @return {string}
     */
    public get phoneNumber(): string {
        return this._phoneNumber;
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
     * Setter id
     * @param {string | number} value
     */
    public set id(value: string | number) {
        this._id = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
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
     * Setter emailVerificationCode
     * @param {number} value
     */
    public set emailVerificationCode(value: number) {
        this._emailVerificationCode = value;
    }

    /**
     * Setter password
     * @param {string} value
     */
    public set password(value: string) {
        this._password = value;
    }

    /**
     * Setter phoneNumber
     * @param {string} value
     */
    public set phoneNumber(value: string) {
        this._phoneNumber = value;
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
}

const ola = "uolas";
