// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { CustomerId } from "./CustomerId";
// import { PlanVariant } from "./PlanVariant/PlanVariant";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { Address } from "../address/Address";
import { PaymentMethod } from "./paymentMethod/PaymentMethod";
import { PaymentMethodId } from "./paymentMethod/PaymentMethodId";
import { method } from "lodash";

export class Customer extends Entity<Customer> {
    private _email: string;
    private _isEmailVerified: boolean;
    private _stripeId: string;
    private _paymentMethods: PaymentMethod[];
    private _shippingAddress?: Address;
    private _billingAddress?: Address;
    private _password?: UserPassword;
    private _state?: string;
    private _codeToRecoverPassword?: string;

    protected constructor(
        email: string,
        isEmailVerified: boolean,
        stripeId: string,
        paymentMethods: PaymentMethod[],
        shippingAddress?: Address,
        billingAddress?: Address,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        id?: CustomerId
    ) {
        super(id);
        this._email = email;
        this._isEmailVerified = isEmailVerified;
        this._stripeId = stripeId;
        this._paymentMethods = paymentMethods;
        this._shippingAddress = shippingAddress;
        this._billingAddress = billingAddress;
        this._password = password;
        this._state = state;
        this._codeToRecoverPassword = codeToRecoverPassword;
    }

    public static create(
        email: string,
        isEmailVerified: boolean,
        stripeId: string,
        paymentMethods: PaymentMethod[],
        shippingAddress?: Address,
        billingAddress?: Address,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        id?: CustomerId
    ): Customer {
        return new Customer(
            email,
            isEmailVerified,
            stripeId,
            paymentMethods,
            shippingAddress,
            billingAddress,
            password,
            state,
            codeToRecoverPassword,
            id
        );
    }

    public changePassword(newPassword: UserPassword): void {
        this.password = newPassword;
    }

    public addPaymentMethod(newPaymentMethod: PaymentMethod): void {
        if (!!!this.hasAtLeastOnePaymentMethod) newPaymentMethod.isDefault = true;

        this.paymentMethods = [...this.paymentMethods, newPaymentMethod];
    }

    public getDefaultPaymentMethod(): PaymentMethod | undefined {
        return this.paymentMethods.find((method) => method.isDefault);
    }

    public setDefaultPaymentMethod(paymentMethodId: PaymentMethodId): void {
        for (let method of this.paymentMethods) {
            if (method.id.equals(paymentMethodId)) {
                method.isDefault = true;
            } else {
                method.isDefault = false;
            }
        }
    }

    public hasPaymentMethodByStripeId(stripePaymentMethodId: string): boolean {
        return this.paymentMethods.some((method) => method.stripeId === stripePaymentMethodId);
    }

    public hasAtLeastOnePaymentMethod(): boolean {
        return this.paymentMethods.length > 0;
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
     * Getter shippingAddress
     * @return {Address | undefined}
     */
    public get shippingAddress(): Address | undefined {
        return this._shippingAddress;
    }

    /**
     * Getter billingAddress
     * @return {Address | undefined}
     */
    public get billingAddress(): Address | undefined {
        return this._billingAddress;
    }

    /**
     * Getter stripeId
     * @return {string}
     */
    public get stripeId(): string {
        return this._stripeId;
    }

    /**
     * Getter paymentMethods
     * @return {PaymentMethod[]}
     */
    public get paymentMethods(): PaymentMethod[] {
        return this._paymentMethods;
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

    /**
     * Setter shippingAddress
     * @param {Address | undefined} value
     */
    public set shippingAddress(value: Address | undefined) {
        this._shippingAddress = value;
    }

    /**
     * Setter billingAddress
     * @param {Address | undefined} value
     */
    public set billingAddress(value: Address | undefined) {
        this._billingAddress = value;
    }

    /**
     * Setter stripeId
     * @param {string} value
     */
    public set stripeId(value: string) {
        this._stripeId = value;
    }

    /**
     * Setter paymentMethods
     * @param {PaymentMethod[]} value
     */
    public set paymentMethods(value: PaymentMethod[]) {
        this._paymentMethods = value;
    }
}
