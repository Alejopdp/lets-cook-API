// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { ICouponType } from "./CuponType/ICuponType";
import { PlanId } from "../plan/PlanId";
import { CouponId } from "../cupons/CouponId";
import { ILimitAplication } from "./LimitAplication/ILimitAplication";
import { Locale } from "../locale/Locale";
import { logger } from "../../../../../config";
import { String } from "aws-sdk/clients/apigateway";
import { Subscription } from "../subscription/Subscription";
import { Plan } from "../plan/Plan";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";

export class Coupon extends Entity<Coupon> {
    private _couponCode: string;
    private _type: ICouponType;
    private _minRequireType: string;
    private _minRequireValue: number;
    private _productsForApplyingType: string;
    private _productsForApplyingValue: PlanId[];
    private _limites: ILimitAplication[];
    private _maxChargeQtyType: string;
    private _maxChargeQtyValue: number;
    private _startDate: Date;
    private _endDate: Date;
    private _state: string;

    protected constructor(
        couponCode: string,
        type: ICouponType,
        minRequireType: string,
        minRequireValue: number,
        productsForApplyingType: string,
        productsForApplyingValue: PlanId[],
        limites: ILimitAplication[],
        maxChargeQtyType: string,
        maxChargeQtyValue: number,
        startDate: Date,
        endDate: Date,
        state: string,
        id?: CouponId
    ) {
        super(id);
        this._couponCode = couponCode;
        this._type = type;
        this._minRequireType = minRequireType;
        this._minRequireValue = minRequireValue;
        this._productsForApplyingType = productsForApplyingType;
        this._productsForApplyingValue = productsForApplyingValue;
        this._limites = limites;
        this._maxChargeQtyType = maxChargeQtyType;
        this._maxChargeQtyValue = maxChargeQtyValue;
        this._startDate = startDate;
        this._endDate = endDate;
        this._state = state;
    }

    public static create(
        couponCode: string,
        type: ICouponType,
        minRequireType: string,
        minRequireValue: number,
        productsForApplyingType: string,
        productsForApplyingValue: PlanId[],
        limites: ILimitAplication[],
        maxChargeQtyType: string,
        maxChargeQtyValue: number,
        startDate: Date,
        endDate: Date,
        state: string,
        id?: CouponId
    ): Coupon {
        return new Coupon(
            couponCode,
            type,
            minRequireType,
            minRequireValue,
            productsForApplyingType,
            productsForApplyingValue,
            limites,
            maxChargeQtyType,
            maxChargeQtyValue,
            startDate,
            endDate,
            state,
            id
        );
    }

    public updateState(state: string): void {
        this.state = state;
    }

    public isValid(subscriptions: Subscription[], plan: Plan, planVariantId: PlanVariantId, shippingCost?: number): boolean {
        if (this.isFreeShippingCoupon() && shippingCost === 0)
            throw new Error("No puedes aplicar un cupón de envío gratis debido a que ya cuentas con envío gratuito");
        if (this.isFreeShippingCoupon() && !shippingCost)
            throw new Error("Para utilizar un cupón de envío gratis primero debes ingresar una dirección de entrega");

        if (this.minRequireType === "amount" && plan.getPlanVariantPrice(planVariantId) < this.minRequireValue)
            throw new Error(`El cupón de descuento ingresado solo aplica para ordenes mayores a ${this.minRequireValue} €`);

        if (this.productsForApplyingType !== "all" && this.productsForApplyingValue.every((planId) => !planId.equals(plan.id)))
            throw new Error("El cupón de descuento no aplica para el plan que estas comprando");

        return this.limites.every((limit) => limit.isValid(subscriptions, this.id));
    }

    public isFreeShippingCoupon(): boolean {
        return this.type.type === "free";
    }

    /**
     * Getter name
     * @return {string}
     */
    public get couponCode(): string {
        return this._couponCode;
    }

    /**
     * Getter description
     * @return {ICouponType}
     */
    public get type(): ICouponType {
        return this._type;
    }

    /**
     * Getter planSku
     * @return {number}
     */
    public get minRequireType(): string {
        return this._minRequireType;
    }

    /**
     * Getter planSku
     * @return {number}
     */
    public get minRequireValue(): number {
        return this._minRequireValue;
    }

    /**
     * Getter imageUrl
     * @return {PlanId}
     */
    public get productsForApplyingType(): string {
        return this._productsForApplyingType;
    }

    /**
     * Getter imageUrl
     * @return {PlanId}
     */
    public get productsForApplyingValue(): PlanId[] {
        return this._productsForApplyingValue;
    }

    /**
     * Getter type
     * @return {ILimitAplication}
     */
    public get limites(): ILimitAplication[] {
        return this._limites;
    }

    /**
     * Getter isActive
     * @return {number}
     */
    public get maxChargeQtyType(): string {
        return this._maxChargeQtyType;
    }

    /**
     * Getter isActive
     * @return {number}
     */
    public get maxChargeQtyValue(): number {
        return this._maxChargeQtyValue;
    }

    /**
     * Getter planVariants
     * @return {Number}
     */
    public get startDate(): Date {
        return this._startDate;
    }

    /**
     * Getter planVariants
     * @return {Number}
     */
    public get endDate(): Date {
        return this._endDate;
    }

    /**
     * Getter availablePlanFrecuencies
     * @return {string}
     */
    public get state(): string {
        return this._state;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set couponCode(value: string) {
        this._couponCode = value;
    }

    /**
     * Setter type
     * @param {ICouponType} value
     */
    public set type(value: ICouponType) {
        this._type = value;
    }

    /**
     * Setter planSku
     * @param {String} value
     */
    public set minRequireType(value: string) {
        this._minRequireType = value;
    }

    /**
     * Setter imageUrl
     * @param {number} value
     */
    public set minRequireValue(value: number) {
        this._minRequireValue = value;
    }

    /**
     * Setter isActive
     * @param {string} value
     */
    public set productsForApplyingType(value: string) {
        this._productsForApplyingType = value;
    }

    /**
     * Setter type
     * @param {PlanId[]} value
     */
    public set productsForApplyingValue(value: PlanId[]) {
        this._productsForApplyingValue = value;
    }

    /**
     * Setter planVariants
     * @param {ILimitAplication[]} value
     */
    public set limites(value: ILimitAplication[]) {
        // if (value.length < 1) throw new Error("No puede crear un plan sin ninguna variante");
        this._limites = value;
    }

    /**
     * Setter availablePlanFrecuencies
     * @param {string} value
     */
    public set maxChargeQtyType(value: string) {
        this._maxChargeQtyType = value;
    }

    /**
     * Setter hasRecipes
     * @param {number} value
     */
    public set maxChargeQtyValue(value: number) {
        this._maxChargeQtyValue = value;
    }

    /**
     * Setter additionalPlans
     * @param {Date} value
     */
    public set startDate(value: Date) {
        this._startDate = value;
    }

    /**
     * Setter locale
     * @param {Date} value
     */
    public set endDate(value: Date) {
        this._endDate = value;
    }

    /**
     * Setter locale
     * @param {string} value
     */
    public set state(value: string) {
        this._state = value;
    }
}
