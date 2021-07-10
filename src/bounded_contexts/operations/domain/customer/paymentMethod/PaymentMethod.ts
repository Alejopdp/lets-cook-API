import { Entity } from "../../../../../core/domain/Entity";
import { PaymentMethodId } from "./PaymentMethodId";

export class PaymentMethod extends Entity<PaymentMethod> {
    private _brand: string;
    private _last4Numbers: string;
    private _exp_month: number;
    private _exp_year: number;
    private _cvc: string;
    private _isDefault: boolean;
    private _stripeId: string;

    constructor(
        brand: string,
        last4Numbers: string,
        exp_month: number,
        exp_year: number,
        cvc: string,
        isDefault: boolean,
        stripeId: string,
        id?: PaymentMethodId
    ) {
        super(id);
        this._brand = brand;
        this._last4Numbers = last4Numbers;
        this._exp_month = exp_month;
        this._exp_year = exp_year;
        this._cvc = cvc;
        this._isDefault = isDefault;
        this._stripeId = stripeId;
    }

    public getCardLabel(): string {
        return `${this.brand} terminada en ${this.last4Numbers}`;
    }

    public getExpirationDate(): string {
        return `Expira el ${this.exp_month}/${this.exp_year}`;
    }

    public changePaymentData(brand: string, last4Numbers: string, exp_month: number, exp_year: number, cvc: string, stripeId: string, isDefault: boolean): void {
        this.brand = brand;
        this.last4Numbers = last4Numbers;
        this.exp_month = exp_month;
        this.exp_year = exp_year;
        this.cvc = cvc;
        this.stripeId = stripeId;
        this.isDefault = isDefault;
    }

    /**
     * Getter brand
     * @return {string}
     */
    public get brand(): string {
        return this._brand;
    }

    /**
     * Getter last4Numbers
     * @return {string}
     */
    public get last4Numbers(): string {
        return this._last4Numbers;
    }

    /**
     * Getter exp_month
     * @return {number}
     */
    public get exp_month(): number {
        return this._exp_month;
    }

    /**
     * Getter exp_year
     * @return {number}
     */
    public get exp_year(): number {
        return this._exp_year;
    }

    /**
     * Getter cvc
     * @return {string}
     */
    public get cvc(): string {
        return this._cvc;
    }

    /**
     * Getter isDefault
     * @return {boolean}
     */
    public get isDefault(): boolean {
        return this._isDefault;
    }

    /**
     * Getter stripeId
     * @return {string}
     */
    public get stripeId(): string {
        return this._stripeId;
    }

    /**
     * Setter brand
     * @param {string} value
     */
    public set brand(value: string) {
        this._brand = value;
    }

    /**
     * Setter last4Numbers
     * @param {string} value
     */
    public set last4Numbers(value: string) {
        this._last4Numbers = value;
    }

    /**
     * Setter exp_month
     * @param {number} value
     */
    public set exp_month(value: number) {
        this._exp_month = value;
    }

    /**
     * Setter exp_year
     * @param {number} value
     */
    public set exp_year(value: number) {
        this._exp_year = value;
    }

    /**
     * Setter cvc
     * @param {string} value
     */
    public set cvc(value: string) {
        this._cvc = value;
    }

    /**
     * Setter isDefault
     * @param {boolean} value
     */
    public set isDefault(value: boolean) {
        this._isDefault = value;
    }

    /**
     * Setter stripeId
     * @param {string} value
     */
    public set stripeId(value: string) {
        this._stripeId = value;
    }
}
