import { Entity } from "@src/core/domain/Entity";
import { UniqueEntityID } from "@src/core/domain/UniqueEntityID";

export class Wallet extends Entity<Wallet>  {
    private _balance: number;
    private _amountToCharge: number;
    private _paymentMethodForCharging: string;


    constructor(balance: number, amountToCharge: number, paymentMethodForCharging: string, id: UniqueEntityID) {
        super(id);
        this._balance = balance;
        this._amountToCharge = amountToCharge;
        this._paymentMethodForCharging = paymentMethodForCharging;
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