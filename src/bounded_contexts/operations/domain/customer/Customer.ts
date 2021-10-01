// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { CustomerId } from "./CustomerId";
// import { PlanVariant } from "./PlanVariant/PlanVariant";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { Address } from "../address/Address";
import { Billing } from "../billing/Billing";
import { PaymentMethod } from "./paymentMethod/PaymentMethod";
import { PaymentMethodId } from "./paymentMethod/PaymentMethodId";
import { PersonalInfo } from "./personalInfo/PersonalInfo";
import { filter, method } from "lodash";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Locale } from "../locale/Locale";
import { IPreferredDeliveryTime } from "./preferredDeliveryTime/IPreferredDeliveryTime";

export class Customer extends Entity<Customer> {
    private _email: string;
    private _isEmailVerified: boolean;
    private _stripeId: string;
    private _paymentMethods: PaymentMethod[];
    private _shippingAddress?: Address;
    private _billingAddress?: Billing;
    private _password?: UserPassword;
    private _state?: string;
    private _codeToRecoverPassword?: string;
    private _personalInfo?: PersonalInfo;

    protected constructor(
        email: string,
        isEmailVerified: boolean,
        stripeId: string,
        paymentMethods: PaymentMethod[],
        shippingAddress?: Address,
        billingAddress?: Billing,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        personalInfo?: PersonalInfo,
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
        this._personalInfo = personalInfo;
    }

    public static create(
        email: string,
        isEmailVerified: boolean,
        stripeId: string,
        paymentMethods: PaymentMethod[],
        shippingAddress?: Address,
        billingAddress?: Billing,
        password?: UserPassword,
        state?: string,
        codeToRecoverPassword?: string,
        personalInfo?: PersonalInfo,
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
            personalInfo,
            id
        );
    }

    public changePassword(newPassword: UserPassword): void {
        this.password = newPassword;
    }

    public addPaymentMethod(newPaymentMethod: PaymentMethod): void {
        if (!this.hasAtLeastOnePaymentMethod() || this.hasNoDefaultPaymentMethod()) newPaymentMethod.isDefault = true;

        this.paymentMethods = [...this.paymentMethods, newPaymentMethod];
    }

    public addPaymentMethodAndSetItAsDefault(newPaymentMethod: PaymentMethod): void {
        newPaymentMethod.isDefault = true;
        this.paymentMethods.forEach((paymentMethod) => (paymentMethod.isDefault = false));
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

    public hasNoDefaultPaymentMethod(): boolean {
        return this.paymentMethods.every((method) => !method.isDefault);
    }

    public hasDifferentLatAndLngAddress(lat: number, lng: number): boolean {
        return this.shippingAddress?.latitude !== lat || this.shippingAddress?.longitude !== lng;
    }

    public getDefaultPaymentMethodCardLabel(): string {
        const defaultMethod: PaymentMethod = this.getDefaultPaymentMethod()!;

        return defaultMethod.getCardLabel();
    }

    public getDefaultPaymentMethodExpirationDateLabel(): string {
        const defaultMethod: PaymentMethod = this.getDefaultPaymentMethod()!;

        return defaultMethod.getExpirationDate();
    }

    public getPaymentMethodStripeId(paymentMethodId: PaymentMethodId): string {
        const paymentMethod: PaymentMethod | undefined = this.paymentMethods.find((method) => method.id.equals(paymentMethodId));

        return paymentMethod?.stripeId || "";
    }

    public getFullNameOrEmail(): string {
        if (!!!this.getPersonalInfo().fullName) return this.email;

        return this.getPersonalInfo().fullName!;
    }

    public getPersonalInfo(): {
        name?: string;
        lastName?: string;
        fullName?: string;
        phone1?: string;
        phone2?: string;
        birthDate?: string;
        birthDateValue?: Date;
        preferredLanguage?: string;
    } {
        return {
            name: this.personalInfo?.name,
            lastName: this.personalInfo?.lastName,
            fullName:
                !!!this.personalInfo?.name && !!!this.personalInfo?.lastName
                    ? ""
                    : `${this.personalInfo?.name || ""} ${this.personalInfo?.lastName || ""}`,
            phone1: this.personalInfo?.phone1,
            phone2: this.personalInfo?.phone2,
            birthDate: this.personalInfo?.birthDate?.toDateString(),
            birthDateValue: this.personalInfo?.birthDate,
            preferredLanguage: this.personalInfo?.preferredLanguage,
        };
    }

    public changePersonalInfo(
        name: string,
        lastName: string,
        phone1: string,
        phone2: string,
        birthDate: Date,
        preferredLanguage: string
    ): void {
        if (!this.personalInfo) {
            const personalInfo: PersonalInfo = new PersonalInfo(name, lastName, phone1, phone2, birthDate, preferredLanguage);
            this.personalInfo = personalInfo;
        } else {
            this.personalInfo?.changeInfo(name, lastName, phone1, phone2, birthDate, preferredLanguage);
        }
    }

    public changeBillingAddress(
        lat: number,
        long: number,
        addressName: string,
        customerName: string,
        details: string,
        identification: string
    ): void {
        if (!this.billingAddress) {
            const billingAddress: Billing = new Billing(lat, long, addressName, customerName, details, identification);
            this.billingAddress = billingAddress;
        } else {
            this.billingAddress?.changeInfoBilling(lat, long, addressName, customerName, details, identification);
        }
    }

    public getShippingAddress(locale: Locale = Locale.es): {
        name?: string;
        details?: string;
        preferredShippingHour: string;
        latitude?: number;
        longitude?: number;
    } {
        return {
            details: this.shippingAddress?.details,
            name: this.shippingAddress?.name,
            preferredShippingHour: this.shippingAddress?.deliveryTime?.value() || "",
            latitude: this.shippingAddress?.latitude,
            longitude: this.shippingAddress?.longitude,
        };
    }

    public getBillingData(): {
        addressName?: string;
        details?: string;
        customerName?: string;
        identification?: string;
        latitude?: number;
        longitude?: number;
    } {
        return {
            addressName: this.billingAddress?.addressName,
            details: this.billingAddress?.details,
            customerName: this.billingAddress?.customerName,
            identification: this.billingAddress?.identification,
            latitude: this.billingAddress?.latitude,
            longitude: this.billingAddress?.longitude,
        };
    }

    public changeShippingAddress(
        lat: number,
        long: number,
        name: string,
        fullName: string,
        details: string,
        deliveryTime?: IPreferredDeliveryTime
    ): void {
        if (!this.shippingAddress) {
            const shippingAddress: Address = new Address(lat, long, name, fullName, details, deliveryTime);
            this.shippingAddress = shippingAddress;
        } else {
            this.shippingAddress?.changeInfoShipping(lat, long, name, fullName, details, deliveryTime);
        }
    }

    public changePaymentMethod(
        paymentId: string,
        brand: string,
        last4Numbers: string,
        exp_month: number,
        exp_year: number,
        cvc: string,
        stripeId: string,
        isDefault: boolean
    ): void {
        const filterPaymentById = this.paymentMethods.filter((payment: PaymentMethod) => payment.id.value === paymentId);

        if (filterPaymentById.length > 0) {
            if (isDefault) {
                for (let paymentMethod of this.paymentMethods) {
                    if (paymentMethod.id.equals(new PaymentMethodId(paymentId))) {
                        paymentMethod.isDefault = true;
                    } else {
                        paymentMethod.isDefault = false;
                    }
                }
            }
            // filterPaymentById[0].changePaymentData(brand, last4Numbers, exp_month, exp_year, cvc, stripeId, isDefault);
        } else {
            if (isDefault) {
                if (this.paymentMethods.length > 0) {
                    const filterPaymentsByDiferentId = this.paymentMethods.filter(
                        (payment: PaymentMethod) => payment.id.value !== paymentId
                    );
                    filterPaymentsByDiferentId.map((payments: PaymentMethod) => (payments.isDefault = false));
                }
            }
            const paymentMethod: PaymentMethod = new PaymentMethod(brand, last4Numbers, exp_month, exp_year, cvc, isDefault, stripeId);
            this.paymentMethods = [...this.paymentMethods, paymentMethod];
        }
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
    public get billingAddress(): Billing | undefined {
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
     * Getter personalInfo
     * @return {PersonalInfo}
     */
    public get personalInfo(): PersonalInfo | undefined {
        return this._personalInfo;
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
    public set billingAddress(value: Billing | undefined) {
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

    /**
     * Setter personalInfo
     * @param {PersonalInfo} value
     */
    public set personalInfo(value: PersonalInfo | undefined) {
        this._personalInfo = value;
    }
}
