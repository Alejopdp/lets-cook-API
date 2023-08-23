import { Entity } from "../../../../../core/domain/Entity";
import { UniqueEntityID } from "../../../../../core/domain/UniqueEntityID";
import { DateOfCharge } from "./DateOfCharge";
import Big from 'big.js';

export class Wallet extends Entity<Wallet>  {
    private _balance: number;
    private _amountToCharge: number;
    private _paymentMethodForCharging: string;
    private _isEnabled: boolean;
    private _datesOfCharge: DateOfCharge[];


    constructor(balance: number, amountToCharge: number, paymentMethodForCharging: string, isEnabled: boolean, datesOfCharge: DateOfCharge[], id: UniqueEntityID) {
        if (datesOfCharge.length > 7) throw new Error("You cannot select more than 7 days of charge");
        if (amountToCharge < 0.5) throw new Error("Amount to charge must be greater than 0.5");
        const days = datesOfCharge.map(dateOfCharge => dateOfCharge.day.dayNumberOfWeek);
        const hasDuplicates = (new Set(days)).size !== days.length;
        if (hasDuplicates) throw new Error("You cannot select a day of charge more than once");

        super(id);
        this._balance = balance;
        this._amountToCharge = amountToCharge;
        this._paymentMethodForCharging = paymentMethodForCharging;
        this._isEnabled = isEnabled;
        this._datesOfCharge = datesOfCharge;
    }

    public chargeMoney(amount: number): void {
        if (amount < 0.5) throw new Error("Amount to charge must be greater than 0.5");
        const bigAmountToCharge = new Big(amount);
        const bigBalance = new Big(this.balance);

        this.balance = Number(bigAmountToCharge.plus(bigBalance));
    }

    public updateAmountToCharge(amountToCharge: number): void {
        if (amountToCharge < 0.5) throw new Error("Amount to charge must be greater than 0.5");

        this.amountToCharge = amountToCharge;
    }

    public updateDatesOfCharge(datesOfCharge: DateOfCharge[]): void {
        if (datesOfCharge.length > 7) throw new Error("You cannot select more than 7 days of charge");
        const days = datesOfCharge.map(dateOfCharge => dateOfCharge.day.dayNumberOfWeek);
        const hasDuplicates = (new Set(days)).size !== days.length;
        if (hasDuplicates) throw new Error("You cannot select a day of charge more than once");
        if (datesOfCharge.length === 0) throw new Error("Tienes que ingresar al menos una fecha de cobro");


        this.datesOfCharge = datesOfCharge;
    }

    /**
     * Getter balance
     * @return {number}
     */
    public get balance(): number {
        return this._balance;
    }

    /**
     * Getter amountToCharge
     * @return {number}
     */
    public get amountToCharge(): number {
        return this._amountToCharge;
    }

    /**
     * Getter paymentMethodForCharging
     * @return {string}
     */
    public get paymentMethodForCharging(): string {
        return this._paymentMethodForCharging;
    }


    /**
     * Getter isEnabled
     * @return {boolean}
     */
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    /**
     * Getter datesOfCharge
     * @return {DateOfCharge[]}
     */
    public get datesOfCharge(): DateOfCharge[] {
        return this._datesOfCharge;
    }

    /**
     * Setter isEnabled
     * @param {boolean} value
     */
    public set isEnabled(value: boolean) {
        this._isEnabled = value;
    }

    /**
     * Setter datesOfCharge
     * @param {DateOfCharge[]} value
     */
    public set datesOfCharge(value: DateOfCharge[]) {
        this._datesOfCharge = value;
    }


    /**
     * Setter balance
     * @param {number} value
     */
    public set balance(value: number) {
        this._balance = value;
    }

    /**
     * Setter amountToCharge
     * @param {number} value
     */
    public set amountToCharge(value: number) {
        this._amountToCharge = value;
    }

    /**
     * Setter paymentMethodForCharging
     * @param {string} value
     */
    public set paymentMethodForCharging(value: string) {
        this._paymentMethodForCharging = value;
    }

}