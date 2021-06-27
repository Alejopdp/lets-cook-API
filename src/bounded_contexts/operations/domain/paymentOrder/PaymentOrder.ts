import { Entity } from "../../../../core/domain/Entity";
import { Week } from "../week/Week";
import { PaymentOrderId } from "./PaymentOrderId";
import { IPaymentOrderState } from "./paymentOrderState/IPaymentOrderState";

export class PaymentOrder extends Entity<PaymentOrder> {
    private _shippingDate: Date;
    private _state: IPaymentOrderState;
    private _paymentIntentId: string;
    private _billingDate: Date;
    private _week: Week;
    private _amount: number;
    private _discountAmount: number;
    private _shippingCost: number;

    constructor(
        shippingDate: Date,
        state: IPaymentOrderState,
        paymentIntentId: string,
        billingDate: Date,
        week: Week,
        amount: number,
        discountAmount: number,
        shippingCost: number,
        paymentOrderId?: PaymentOrderId
    ) {
        super(paymentOrderId);
        this._shippingDate = shippingDate;
        this._state = state;
        this._paymentIntentId = paymentIntentId;
        this._billingDate = billingDate;
        this._week = week;
        this._amount = amount;
        this._discountAmount = discountAmount;
        this._shippingCost = shippingCost;
    }

    /**
     * Getter shippingDate
     * @return {Date}
     */
    public get shippingDate(): Date {
        return this._shippingDate;
    }

    /**
     * Getter state
     * @return {IPaymentOrderState}
     */
    public get state(): IPaymentOrderState {
        return this._state;
    }

    /**
     * Getter paymentIntentId
     * @return {string}
     */
    public get paymentIntentId(): string {
        return this._paymentIntentId;
    }

    /**
     * Getter billingDate
     * @return {Date}
     */
    public get billingDate(): Date {
        return this._billingDate;
    }

    /**
     * Getter week
     * @return {Week}
     */
    public get week(): Week {
        return this._week;
    }

    /**
     * Getter amount
     * @return {number}
     */
    public get amount(): number {
        return this._amount;
    }

    /**
     * Getter discountAmount
     * @return {number}
     */
    public get discountAmount(): number {
        return this._discountAmount;
    }

    /**
     * Getter shippingCost
     * @return {number}
     */
    public get shippingCost(): number {
        return this._shippingCost;
    }

    /**
     * Setter shippingDate
     * @param {Date} value
     */
    public set shippingDate(value: Date) {
        this._shippingDate = value;
    }

    /**
     * Setter state
     * @param {IPaymentOrderState} value
     */
    public set state(value: IPaymentOrderState) {
        this._state = value;
    }

    /**
     * Setter paymentIntentId
     * @param {string} value
     */
    public set paymentIntentId(value: string) {
        this._paymentIntentId = value;
    }

    /**
     * Setter billingDate
     * @param {Date} value
     */
    public set billingDate(value: Date) {
        this._billingDate = value;
    }

    /**
     * Setter week
     * @param {Week} value
     */
    public set week(value: Week) {
        this._week = value;
    }

    /**
     * Setter amount
     * @param {number} value
     */
    public set amount(value: number) {
        this._amount = value;
    }

    /**
     * Setter discountAmount
     * @param {number} value
     */
    public set discountAmount(value: number) {
        this._discountAmount = value;
    }

    /**
     * Setter shippingCost
     * @param {number} value
     */
    public set shippingCost(value: number) {
        this._shippingCost = value;
    }
}
