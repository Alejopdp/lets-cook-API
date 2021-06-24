import { Entity } from "../../../../core/domain/Entity";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";
import { WeekId } from "../week/WeekId";
import { OrderId } from "./OrderId";
import { IOrderState } from "./orderState/IOrdeState";

export class Order extends Entity<Order> {
    private _shippingDate: Date;
    private _state: IOrderState;
    private _billingDate: Date;
    private _weekId: WeekId;
    private _planVariantId: PlanVariantId;
    private _price: number;

    constructor(
        shippingDate: Date,
        state: IOrderState,
        billingDate: Date,
        weekId: WeekId,
        planVariantId: PlanVariantId,
        price: number,
        orderId?: OrderId
    ) {
        super(orderId);
        this._shippingDate = shippingDate;
        this._state = state;
        this._billingDate = billingDate;
        this._weekId = weekId;
        this._planVariantId = planVariantId;
        this._price = price;
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
     * @return {IOrderState}
     */
    public get state(): IOrderState {
        return this._state;
    }

    /**
     * Getter billingDate
     * @return {Date}
     */
    public get billingDate(): Date {
        return this._billingDate;
    }

    /**
     * Getter weekId
     * @return {WeekId}
     */
    public get weekId(): WeekId {
        return this._weekId;
    }

    /**
     * Getter planVariantId
     * @return {PlanVariantId}
     */
    public get planVariantId(): PlanVariantId {
        return this._planVariantId;
    }

    /**
     * Getter price
     * @return {number}
     */
    public get price(): number {
        return this._price;
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
     * @param {IOrderState} value
     */
    public set state(value: IOrderState) {
        this._state = value;
    }

    /**
     * Setter billingDate
     * @param {Date} value
     */
    public set billingDate(value: Date) {
        this._billingDate = value;
    }

    /**
     * Setter weekId
     * @param {WeekId} value
     */
    public set weekId(value: WeekId) {
        this._weekId = value;
    }

    /**
     * Setter planVariantId
     * @param {PlanVariantId} value
     */
    public set planVariantId(value: PlanVariantId) {
        this._planVariantId = value;
    }

    /**
     * Setter price
     * @param {number} value
     */
    public set price(value: number) {
        this._price = value;
    }
}
