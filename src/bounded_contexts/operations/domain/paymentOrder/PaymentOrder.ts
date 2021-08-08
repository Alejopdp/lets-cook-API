import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { CustomerId } from "../customer/CustomerId";
import { Order } from "../order/Order";
import { Week } from "../week/Week";
import { PaymentOrderId } from "./PaymentOrderId";
import { IPaymentOrderState } from "./paymentOrderState/IPaymentOrderState";
import { PaymentOrderStateFactory } from "./paymentOrderState/PaymentOrderFactory";

export class PaymentOrder extends Entity<PaymentOrder> {
    private _shippingDate: Date;
    private _state: IPaymentOrderState;
    private _paymentIntentId: string;
    private _billingDate: Date;
    private _week: Week;
    private _amount: number;
    private _discountAmount: number;
    private _shippingCost: number;
    private _customerId: CustomerId;

    constructor(
        shippingDate: Date,
        state: IPaymentOrderState,
        paymentIntentId: string,
        billingDate: Date,
        week: Week,
        amount: number,
        discountAmount: number,
        shippingCost: number,
        customerId: CustomerId,
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
        this._customerId = customerId;
    }

    public addOrder(order: Order): void {
        order.paymentOrderId = this.id;
        this.amount = this.amount + order.price; // TO DO: Add price with discount
        // this.discountAmount = this.discountAmount + 1 // TO DO: Add discountAmount
    }

    public updateState(newState: string, orders: Order[]): void {
        const newPaymentOrderState: IPaymentOrderState = PaymentOrderStateFactory.createState(newState);

        if (newPaymentOrderState.isActive()) this.toActive(orders);
        if (newPaymentOrderState.isBilled()) this.toBilled(orders);
        if (newPaymentOrderState.isPendingConfirmation()) this.toPendingConfirmation(orders);
        if (newPaymentOrderState.isRejected()) this.toRejected(orders);
    }

    public getHumanBillingDate(): string {
        return MomentTimeService.getDateHumanLabel(this.billingDate);
    }
    public getDdMmYyyyBillingDate(): string {
        return MomentTimeService.getDdMmYyyy(this.billingDate);
    }

    public toBilled(orders: Order[]): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.bill(); // TO DO: Handle this?
        }

        this.state.toBilled(this);
    }

    public toActive(orders: Order[]): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.reactivate(); // TO DO: Handle this?
        }

        this.state.toActive(this);
    }

    public toPendingConfirmation(orders: Order[]): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.toPaymentPending(); // TO DO: Handle this?
        }

        this.state.toPendingConfirmation(this);
    }

    public toRejected(orders: Order[]): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.toPaymentRejected(); // TO DO: Handle this?
        }

        this.state.toRejected(this);
    }

    public getTotalAmount(): number {
        return this.amount + this.shippingCost - this.discountAmount;
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
     * Getter customerId
     * @return {CustomerId}
     */
    public get customerId(): CustomerId {
        return this._customerId;
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

    /**
     * Setter customerId
     * @param {CustomerId} value
     */
    public set customerId(value: CustomerId) {
        this._customerId = value;
    }
}
