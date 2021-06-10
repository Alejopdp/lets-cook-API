import { updateShippingZone } from './../../useCases/updateShippingZone/index';
// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { ShippingZoneRadio } from "./ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from './ShippingZoneRadio/Coordinates';
import { ShippingZoneId } from "../shipping/ShippingZoneId";
import { CouponId } from "../cupons/CouponId";
// import { ILimitAplication } from "./LimitAplication/ILimitAplication";
// import { PlanType } from "./PlanType/PlanType";
// import { PlanVariant } from "./PlanVariant/PlanVariant";
import { Locale } from "../locale/Locale";
import { logger } from "../../../../../config";
import { String } from "aws-sdk/clients/apigateway";

export class ShippingZone extends Entity<ShippingZone> {
    private _name: string;
    private _reference: string;
    private _cost: number;
    private _state: string;
    private _radio: ShippingZoneRadio;

    protected constructor(
        name: string,
        reference: string,
        cost: number,
        state: string,
        radio: ShippingZoneRadio,
        id?: ShippingZoneId
    ) {
        super(id);
        this._name = name;
        this._reference = reference;
        this._cost = cost;
        this._state = state;
        this._radio = radio;
    }

    public static create(
        name: string,
        reference: string,
        cost: number,
        state: string,
        radio: ShippingZoneRadio,
        id?: ShippingZoneId
    ): ShippingZone {

        return new ShippingZone(
            name,
            reference,
            cost,
            state,
            radio,
            id
        );
    }

    public updateShippingRadio(radio: ShippingZoneRadio): void {
        this.radio = radio;
    }

    public updateState(state: string): void {
        this.state = state;
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
    public get name(): string {
        return this._name;
    }

    /**
     * Getter reference
     * @return {string}
     */
     public get reference(): string {
        return this._reference;
    }

    /**
     * Getter cost
     * @return {number}
     */
     public get cost(): number {
        return this._cost;
    }

    /**
     * Getter state
     * @return {string}
     */
     public get state(): string {
        return this._state;
    }

    /**
     * Getter radio
     * @return {ShippingZoneRadio}
     */
    public get radio(): ShippingZoneRadio {
        return this._radio;
    }


    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter reference
     * @param {String} value
     */
     public set reference(value: string) {
        this._reference = value;
    }

    /**
     * Setter cost
     * @param {number} value
     */
    public set cost(value: number) {
        this._cost = value;
    }

    /**
     * Setter reference
     * @param {string} value
     */
     public set state(value: string) {
        this._state = value;
    }

    /**
     * Setter radio
     * @param {ShippingZoneRadio} value
     */
    public set radio(value: ShippingZoneRadio) {
        this._radio = value;
    }
}
