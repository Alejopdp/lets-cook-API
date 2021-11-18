// Principal
import { Entity } from "../../../../core/domain/Entity";
import { ICouponType } from "./CuponType/ICuponType";
import { PlanId } from "../plan/PlanId";
import { CouponId } from "../cupons/CouponId";
import { ILimitAplication } from "./LimitAplication/ILimitAplication";
import { Subscription } from "../subscription/Subscription";
import { Plan } from "../plan/Plan";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";
import { Customer } from "../customer/Customer";
import { CustomerId } from "../customer/CustomerId";
import { CouponState } from "./CouponState";

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
    private _endDate?: Date;
    private _state: CouponState;
    private _quantityApplied: number;
    private _customersWhoHaveApplied: CustomerId[];

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
        state: CouponState,
        quantityApplied: number,
        customersWhoHaveApplied: CustomerId[],
        endDate?: Date,
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
        this._quantityApplied = quantityApplied;
        this._customersWhoHaveApplied = customersWhoHaveApplied;
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
        state: CouponState,
        quantityApplied: number,
        customersWhoHaveApplied: CustomerId[] = [],
        endDate?: Date,
        id?: CouponId
    ): Coupon {
        const maxChargesQty = maxChargeQtyType === "only_fee" ? 1 : maxChargeQtyType === "all_fee" ? 0 : maxChargeQtyValue;
        const minimumRequirementValue = minRequireType === "amount" ? minRequireValue : 0;

        return new Coupon(
            couponCode.toUpperCase(),
            type,
            minRequireType,
            minimumRequirementValue,
            productsForApplyingType,
            productsForApplyingValue,
            limites,
            maxChargeQtyType,
            maxChargesQty,
            startDate,
            state,
            quantityApplied,
            customersWhoHaveApplied,
            endDate,
            id
        );
    }

    public updateState(state: CouponState): void {
        this.state = state;
    }

    public isValid(customerSubscriptions: Subscription[], plan: Plan, planVariantId: PlanVariantId, shippingCost?: number): boolean {
        if (this.isValidatingAFreeShippingCouponWithoutHavingAnAddress(shippingCost) && shippingCost === 0)
            throw new Error("No puedes aplicar un cupón de envío gratis con una dirección sin coste de envío");
        if (this.isValidatingAFreeShippingCouponWithoutHavingAnAddress(shippingCost))
            throw new Error("Para utilizar un cupón de envío gratis primero debes ingresar una dirección de entrega");
        if (this.isValidatingAFreeShippingCouponWithoutShippingCost(shippingCost!))
            throw new Error("No puedes aplicar un cupón de envío gratis debido a que ya cuentas con envío gratuito");

        if (this.isMinimumAmountValid(plan, planVariantId))
            throw new Error(`El cupón de descuento ingresado solo aplica para ordenes mayores a ${this.minRequireValue} €`);

        if (this.isApplyingToRightProducts(plan)) throw new Error("El cupón de descuento no aplica para el plan que estas comprando");

        if (this.state === CouponState.INACTIVE || this.state === CouponState.DELETED || this.state === CouponState.UNAVAILABLE)
            throw new Error("El cupón de descuento no está disponible");

        return this.limites.every((limit) => limit.isValid(customerSubscriptions, this.id)); // Use quantityApplied and customersWhoHaveApplied
    }

    private isValidatingAFreeShippingCouponWithoutShippingCost(shippingCost: number): boolean {
        return this.isFreeShippingCoupon() && shippingCost === 0;
    }

    private isValidatingAFreeShippingCouponWithoutHavingAnAddress(shippingCost?: number): boolean {
        return this.isFreeShippingCoupon() && !shippingCost;
    }

    private isMinimumAmountValid(plan: Plan, planVariantId: PlanVariantId): boolean {
        return this.minRequireType === "amount" && plan.getPlanVariantPrice(planVariantId) < this.minRequireValue;
    }

    private isApplyingToRightProducts(plan: Plan): boolean {
        return this.productsForApplyingType !== "all" && this.productsForApplyingValue.every((planId) => !planId.equals(plan.id));
    }

    public getDiscount(plan: Plan, planVariantId: PlanVariantId, shippingCost: number): number {
        const price = plan.getPlanVariantPrice(planVariantId);
        if (this.type.type === "free") return shippingCost;
        else if (this.type.type === "percent") {
            return (price * this.type.value) / 100;
        } else {
            return this.type.value;
        }
    }

    public isFreeShippingCoupon(): boolean {
        return this.type.type === "free";
    }

    public hasStarted(): boolean {
        return this.startDate < new Date();
    }

    public isExpiredByEndDate(): boolean {
        return !!this.endDate && new Date() > this.endDate;
    }

    public addApplication(customerApplying: Customer): void {
        const applicationLimit: number | undefined = this.limites.find((limit) => limit.type === "limit_qty")?.value;
        this.quantityApplied = this.quantityApplied + 1;
        if (this.quantityApplied === applicationLimit) this.updateState(CouponState.UNAVAILABLE);
        if (this.customersWhoHaveApplied.some((customerId) => customerId.equals(customerApplying.id))) return;
        else this.customersWhoHaveApplied = [...this.customersWhoHaveApplied, customerApplying.id];
    }

    public getCustomersQuantityWhoHaveApplied(): number {
        return this.customersWhoHaveApplied.length;
    }

    public appliesToSpecificProducts(): boolean {
        return this.productsForApplyingType === "specific";
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
     * Getter endDate
     * @return {Date | undefined}
     */
    public get endDate(): Date | undefined {
        return this._endDate;
    }

    /**
     * Getter availablePlanFrecuencies
     * @return {CouponState}
     */
    public get state(): CouponState {
        return this._state;
    }

    /**
     * Getter quantityApplied
     * @return {number}
     */
    public get quantityApplied(): number {
        return this._quantityApplied;
    }

    /**
     * Getter customersWhoHaveApplied
     * @return {CustomerId[]}
     */
    public get customersWhoHaveApplied(): CustomerId[] {
        return this._customersWhoHaveApplied;
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
     * @param {Date | undefined} value
     */
    public set endDate(value: Date | undefined) {
        this._endDate = value;
    }

    /**
     * Setter locale
     * @param {CouponState} value
     */
    public set state(value: CouponState) {
        this._state = value;
    }

    /**
     * Setter quantityApplied
     * @param {number} value
     */
    public set quantityApplied(value: number) {
        this._quantityApplied = value;
    }

    /**
     * Setter customersWhoHaveApplied
     * @param {CustomerId[]} value
     */
    public set customersWhoHaveApplied(value: CustomerId[]) {
        this._customersWhoHaveApplied = value;
    }
}
