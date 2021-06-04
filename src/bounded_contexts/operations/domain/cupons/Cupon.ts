// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { ICouponType } from "./CuponType/ICuponType";
import { PlanId } from "../plan/PlanId";
import { ILimitAplication } from "./LimitAplication/ILimitAplication";
// import { PlanType } from "./PlanType/PlanType";
// import { PlanVariant } from "./PlanVariant/PlanVariant";
import { Locale } from "../locale/Locale";
import { logger } from "../../../../../config";

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
        state: string
    ) {
        super();
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
        state: string
    ): Coupon {
        // const guardedProps = [
        //     { argument: name, argumentName: "Nombre" },
        //     { argument: description, argumentName: "Descripción" },
        //     { argument: type, argumentName: "Tipo de plan" },
        // ];

        // const guardResult = Guard.againstNullOrUndefinedOrEmptyBulk(guardedProps);

        // if (!guardResult.succeeded) {
        //     throw new Error(guardResult.message);
        // }

        // if (planVariants.length < 1) throw new Error("No puede crear un plan sin ninguna variante");
        // if (availablePlanFrecuencies.length < 1) throw new Error("Hay que ingresar al menos 1 frecuencia disponible para el plan");
        // if (type === PlanType.Adicional && additionalPlans.length > 0)
        //     throw new Error("Un plan adicional no puede tener relacionado otros planes adidiconales");

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
            state
        );
    }

    // public toggleState(): void {
    //     // TO DO: Validate existing subscriptions with this plan?

    //     this.isActive = !this.isActive;
    // }

    // public canHaveAdditionalPlans(): boolean {
    //     return this.type === PlanType.Principal;
    // }

    // public updateAdditionalPlans(additionalPlans: Plan[]): void {
    //     if (!this.canHaveAdditionalPlans() && additionalPlans.length > 0)
    //         throw new Error("Un plan adicional no puede tener relacionado otros planes adidiconales");
    //     this.additionalPlans = additionalPlans;
    // }

    // public changeType(newType: PlanType): void {
    //     if (this.type === PlanType.Principal && newType === PlanType.Adicional && this.additionalPlans.length > 0) {
    //         throw new Error("Tiene que desasociar los planes adicionales antes de convertirlo en un plan adicional");
    //     } else {
    //         this.type = newType;
    //     }
    // }

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

    // /**
    //  * Setter planSku
    //  * @param {PlanSku} value
    //  */
    // public set planSku(value: PlanSku) {
    //     this._planSku = value;
    // }

    // /**
    //  * Setter imageUrl
    //  * @param {string} value
    //  */
    // public set imageUrl(value: string) {
    //     this._imageUrl = value;
    // }

    // /**
    //  * Setter isActive
    //  * @param {boolean} value
    //  */
    // public set isActive(value: boolean) {
    //     this._isActive = value;
    // }

    // /**
    //  * Setter type
    //  * @param {PlanType} value
    //  */
    // public set type(value: PlanType) {
    //     this._type = value;
    // }

    // /**
    //  * Setter planVariants
    //  * @param {PlanVariant[]} value
    //  */
    // public set planVariants(value: PlanVariant[]) {
    //     if (value.length < 1) throw new Error("No puede crear un plan sin ninguna variante");

    //     this._planVariants = value;
    // }

    // /**
    //  * Setter availablePlanFrecuencies
    //  * @param {PlanFrequency[]} value
    //  */
    // public set availablePlanFrecuencies(value: PlanFrequency[]) {
    //     this._availablePlanFrecuencies = value;
    // }

    // /**
    //  * Setter hasRecipes
    //  * @param {boolean} value
    //  */
    // public set hasRecipes(value: boolean) {
    //     this._hasRecipes = value;
    // }

    // /**
    //  * Setter additionalPlans
    //  * @param {Plan[]} value
    //  */
    // public set additionalPlans(value: Plan[]) {
    //     this._additionalPlans = value;
    // }

    // /**
    //  * Setter locale
    //  * @param {Locale} value
    //  */
    // public set locale(value: Locale) {
    //     this._locale = value;
    // }
}
