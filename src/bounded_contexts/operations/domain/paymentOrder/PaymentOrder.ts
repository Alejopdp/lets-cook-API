import Big from 'big.js';
import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { CustomerId } from "../customer/CustomerId";
import { Customer } from "../customer/Customer";
import { Order } from "../order/Order";
import { Week } from "../week/Week";
import { PaymentOrderId } from "./PaymentOrderId";
import { IPaymentOrderState } from "./paymentOrderState/IPaymentOrderState";
import { PaymentOrderStateFactory } from "./paymentOrderState/PaymentOrderFactory";
import { Locale } from "../locale/Locale";

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
    private _quantityRefunded: number;
    private _hasFreeShipping: boolean;
    private _lastRecipeSelectionDate?: Date;
    private _humanId?: number;

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
        hasFreeShipping: boolean,
        quantityRefunded: number = 0,
        paymentOrderId?: PaymentOrderId,
        lastRecipeSelectionDate?: Date,
        humanId?: number
    ) {
        super(paymentOrderId);
        this._shippingDate = shippingDate;
        this._state = state;
        this._paymentIntentId = paymentIntentId;
        this._billingDate = billingDate;
        this._week = week;
        this._amount = Math.round(amount * 100) / 100;
        this._discountAmount = Math.round(discountAmount * 100) / 100;
        this._shippingCost = Math.round(shippingCost * 100) / 100;
        this._customerId = customerId;
        this._hasFreeShipping = hasFreeShipping;
        this._quantityRefunded = quantityRefunded;
        this._lastRecipeSelectionDate = lastRecipeSelectionDate;
        this._humanId = humanId;
    }

    public addOrder(order: Order): void {
        order.paymentOrderId = this.id;

        if (this.state.isPendingConfirmation()) return;

        this.amount = (Math.round(this.amount * 100) + Math.round(order.getTotalPrice() * 100)) / 100; // TO DO: Add price with discount
        this.addDiscountAmount(order.discountAmount) // TODO: DONT ADD IF ITS A FREE SHIPPING COUPON AND THE PO ALREADY HAS IT

        if (order.hasFreeShipping) this.hasFreeShipping = true;
        if (this.state.isCancelled()) this.state.toActive(this);
    }

    public discountOrderAmount(order: Order): void {
        const bigPaymentOrderAmount = new Big(this.amount);
        const bigOrderPrice = new Big(order.getTotalPrice());

        this.amount = Number(bigPaymentOrderAmount.minus(bigOrderPrice));
        this.discountDiscountAmount(order.discountAmount)

        if (this.amount === 0 && (this.state.isActive() || this.state.isPendingConfirmation())) this.toCancelled([]);
    }

    public addDiscountAmount(discountAmount: number): void {
        this.discountAmount = (Math.round(this.discountAmount * 100) + Math.round(discountAmount * 100)) / 100
    }

    public discountDiscountAmount(discountAmount: number): void {
        this.discountAmount = (Math.round(this.discountAmount * 100) - Math.round(discountAmount * 100)) / 100

    }

    public updateAmountsAfterSwappingPlan(
        oldPlanPrice: number,
        newPlanPrice: number,
        oldPlanDiscount: number,
        newPlanDiscount: number
    ): void {
        if (this.state.isBilled() || this.isCancelled()) return;
        const newAmount = (Math.round(this.amount * 100) - Math.round(oldPlanPrice * 100) + Math.round(newPlanPrice * 100)) / 100;

        this.amount = newAmount

        if (this.discountAmount > 0) {
            const newDiscountAmount = (Math.round(this.discountAmount * 100) - Math.round(oldPlanDiscount * 100) + Math.round(newPlanDiscount * 100)) / 100;

            this.discountAmount = newDiscountAmount
        }

    }

    public discountOrdersAmount(orders: Order[]): void {
        for (let order of orders) {
            this.discountOrderAmount(order);
        }
    }

    public isCancelled(): boolean {
        return this.state.isCancelled()
    }

    public isActive(): boolean {
        return this.state.isActive()
    }

    public updateState(newState: string, orders: Order[], queryDate: Date): void {
        const newPaymentOrderState: IPaymentOrderState = PaymentOrderStateFactory.createState(newState);

        if (newPaymentOrderState.isActive()) this.toActive(orders, queryDate);
        if (newPaymentOrderState.isBilled()) this.toBilled(orders);
        if (newPaymentOrderState.isPendingConfirmation()) this.toPendingConfirmation(orders);
        if (newPaymentOrderState.isRejected()) this.toRejected(orders);
    }

    public getHumanBillingDate(locale: Locale): string {
        return MomentTimeService.getDateHumanLabel(this.billingDate);
    }
    public getDdMmYyyyBillingDate(): string {
        return MomentTimeService.getDdMmYyyy(this.billingDate);
    }

    public toBilled(orders: Order[], customer?: Customer): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.bill(customer); // TO DO: Handle this?
        }

        this.state.toBilled(this);
    }

    public toActive(orders: Order[], queryDate: Date): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.reactivate(this, queryDate); // TO DO: Handle this?
        }

        this.state.toActive(this);
    }

    public toCancelled(orders: Order[]): void {
        for (let order of orders) {
            if (order.paymentOrderId && order.paymentOrderId.equals(this.id)) order.cancel(); // TO DO: Handle this?
        }

        this.state.toCancelled(this);
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

    // TO DO: Remove the shipping cost outside of this class in createSubscription and payAllSubscriptions AND USE getFinalAmount()
    public getTotalAmount(): number {
        return (Math.round(this.amount * 100) + Math.round(this.shippingCost * 100) - Math.round(this.discountAmount * 100)) / 100;
    }

    // Same as the previous one, but resting the shipping cost.
    public getFinalAmount(): number {
        return (
            (Math.round(this.amount * 100) +
                Math.round(this.shippingCost * 100) -
                Math.round(this.getDiscountAmountOrShippingCostIfHasFreeShipping() * 100)) /
            100
        );
    }

    public getAmountToBillWithoutShippingCost(): number {
        return (Math.round(this.amount * 100) + Math.round(this.discountAmount * 100)) / 100;
    }

    public getDiscountAmountOrShippingCostIfHasFreeShipping(): number {
        return this.hasFreeShipping ? this.shippingCost + this.discountAmount : this.discountAmount;
    }

    public isPaymentRejected(): boolean {
        return this.state.isRejected();
    }

    public isBilled(): boolean {
        return this.state.isBilled();
    }

    public isPartiallyRefunded(): boolean {
        return this.state.title === "PAYMENT_ORDER_PARTIALLY_REFUNDED";
    }

    public refund(amount: number): void {
        if (!!!this.isBilled() && !!!this.isPartiallyRefunded())
            throw new Error("No puede hacer un reembolso de un pago que no fue cobrado o parcialmente reembolsado");
        if ((Math.round(this.quantityRefunded * 100) + Math.round(amount * 100)) / 100 > this.getTotalAmount())
            throw new Error("No puede devolverse una cantidad mayor al total del importe de la orden");
        if (amount <= 0) throw new Error("No puede devolverse una cantidad negativa");
        if ((Math.round(this.quantityRefunded * 100) + Math.round(amount * 100)) / 100 === this.getTotalAmount())
            this.state.toRefunded(this);
        else this.state.toPartiallyRefunded(this);


        this.quantityRefunded = (Math.round(this.quantityRefunded * 100) + Math.round(amount * 100)) / 100;
    }

    public addHumanId(actualPaymentOrdersWithHumanIdCount: number): void {
        this.humanId = 20000 + actualPaymentOrdersWithHumanIdCount + 1;
    }

    public getHumanIdOrIdValue(): string {
        return !!this.humanId ? `#${this.humanId.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : this.id.toString();
    }

    public getPlansAmountMinusDiscount(): number {
        return (Math.round(this.amount * 100) - Math.round(this.discountAmount * 100)) / 100;
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
     * Getter quantityRefunded
     * @return {number}
     */
    public get quantityRefunded(): number {
        return this._quantityRefunded;
    }

    /**
     * Getter hasFreeShipping
     * @return {boolean}
     */
    public get hasFreeShipping(): boolean {
        return this._hasFreeShipping;
    }

    /**
     * Getter lastRecipeSelectionDate
     * @return { Date | undefined}
     */
    public get lastRecipeSelectionDate(): Date | undefined {
        return this._lastRecipeSelectionDate;
    }

    /**
     * Getter humanId
     * @return {number | undefined}
     */
    public get humanId(): number | undefined {
        return this._humanId;
    }

    /**
     * Setter hasFreeShipping
     * @param {boolean} value
     */
    public set hasFreeShipping(value: boolean) {
        this._hasFreeShipping = value;
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

    /**
     * Setter quantityRefunded
     * @param {number} value
     */
    public set quantityRefunded(value: number) {
        this._quantityRefunded = value;
    }

    /**
     * Setter lastRecipeSelectionDate
     * @param {Date | undefined} value
     */
    public set lastRecipeSelectionDate(value: Date | undefined) {
        this._lastRecipeSelectionDate = value;
    }

    /**
     * Setter humanId
     * @param {number | undefined} value
     */
    public set humanId(value: number | undefined) {
        this._humanId = value;
    }
}
