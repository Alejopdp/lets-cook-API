import { Entity } from "../../../../core/domain/Entity";
import { CancellationReason } from "../cancellationReason/CancellationReason";
import { PlanFrequency } from "../plan/PlanFrequency";
import { PlanVariant } from "../plan/PlanVariant/PlanVariant";
import { RecipeVariantRestriction } from "../recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { SubscriptionId } from "./SubscriptionId";
import { ISubscriptionState } from "./subscriptionState/ISubscriptionState";

export class Subscription extends Entity<Subscription> {
    private _planVariant: PlanVariant;
    private _frequency: PlanFrequency;
    private _cancellationReason?: CancellationReason;
    private _state: ISubscriptionState;
    private _restrictionComment: string;
    private _restrictions: RecipeVariantRestriction[];
    private _billingStartDate?: Date;
    private _creationDate: Date;
    private _couponChargesQtyApplied: number;

    constructor(
        planVariant: PlanVariant,
        frequency: PlanFrequency,
        state: ISubscriptionState,
        restrictions: RecipeVariantRestriction[],
        restrictionComment: string,
        creationDate: Date,
        couponChargesQtyApplied: number,
        billingStartDate?: Date,
        cancellationReason?: CancellationReason,
        subscriptionId?: SubscriptionId
    ) {
        super(subscriptionId);
        this._planVariant = planVariant;
        this._frequency = frequency;
        this._state = state;
        this._restrictions = restrictions;
        this._restrictionComment = restrictionComment;
        this._billingStartDate = billingStartDate;
        this._creationDate = creationDate;
        this._couponChargesQtyApplied = couponChargesQtyApplied;
    }

    /**
     * Getter planVariant
     * @return {PlanVariant}
     */
    public get planVariant(): PlanVariant {
        return this._planVariant;
    }

    /**
     * Getter frequency
     * @return {PlanFrequency}
     */
    public get frequency(): PlanFrequency {
        return this._frequency;
    }

    /**
     * Getter state
     * @return {ISubscriptionState}
     */
    public get state(): ISubscriptionState {
        return this._state;
    }

    /**
     * Getter restrictions
     * @return {RecipeVariantRestriction[]}
     */
    public get restrictions(): RecipeVariantRestriction[] {
        return this._restrictions;
    }

    /**
     * Getter billingStartDate
     * @return {Date | undefined}
     */
    public get billingStartDate(): Date | undefined {
        return this._billingStartDate;
    }

    /**
     * Getter creationDate
     * @return {Date}
     */
    public get creationDate(): Date {
        return this._creationDate;
    }

    /**
     * Getter couponChargesQtyApplied
     * @return {number}
     */
    public get couponChargesQtyApplied(): number {
        return this._couponChargesQtyApplied;
    }

    /**
     * Getter cancellationReason
     * @return {CancellatioNReason}
     */
    public get cancellationReason(): CancellationReason {
        return this.cancellationReason;
    }

    /**
     * Getter restrictionComment
     * @return {string}
     */
    public get restrictionComment(): string {
        return this._restrictionComment;
    }

    /**
     * Setter planVariant
     * @param {PlanVariant} value
     */
    public set planVariant(value: PlanVariant) {
        this._planVariant = value;
    }

    /**
     * Setter frequency
     * @param {PlanFrequency} value
     */
    public set frequency(value: PlanFrequency) {
        this._frequency = value;
    }

    /**
     * Setter state
     * @param {ISubscriptionState} value
     */
    public set state(value: ISubscriptionState) {
        this._state = value;
    }

    /**
     * Setter restrictions
     * @param {RecipeVariantRestriction[]} value
     */
    public set restrictions(value: RecipeVariantRestriction[]) {
        this._restrictions = value;
    }

    /**
     * Setter billingStartDate
     * @param {Date | undefined} value
     */
    public set billingStartDate(value: Date | undefined) {
        this._billingStartDate = value;
    }

    /**
     * Setter creationDate
     * @param {Date} value
     */
    public set creationDate(value: Date) {
        this._creationDate = value;
    }

    /**
     * Setter couponChargesQtyApplied
     * @param {number} value
     */
    public set couponChargesQtyApplied(value: number) {
        this._couponChargesQtyApplied = value;
    }

    /**
     * Setter restrictionComment
     * @param {string} value
     */
    public set restrictionComment(value: string) {
        this._restrictionComment = value;
    }
}
