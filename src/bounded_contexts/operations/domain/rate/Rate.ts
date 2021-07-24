import { Entity } from "../../../../core/domain/Entity";
import { CustomerId } from "../customer/CustomerId";
import { RecipeId } from "../recipe/RecipeId";
import { RateId } from "./RateId";

export class Rate extends Entity<Rate> {
    private _customerId: CustomerId;
    private _recipeId: RecipeId;
    private _rateValue?: number;
    private _comment?: string;

    protected constructor(
        customerId: CustomerId, 
        recipeId: RecipeId, 
        rateValue?: number, 
        comment?: string, 
        rateId?: RateId ) {
        super(rateId);
        this._customerId = customerId;
        this._recipeId = recipeId;
        this._rateValue = rateValue;
        this._comment = comment;
    }

    public static create(
        customerId: CustomerId,
        recipeId: RecipeId,
        rateValue?: number,
        comment?: string,
        id?: RateId
    ): Rate {

        return new Rate(
            customerId,
            recipeId,
            rateValue,
            comment,
            id
        );
    }

    public addRate(rateValue: number, commentRate: string): void {
        this.rateValue = rateValue;
        this.comment = commentRate;
    }

    /**
     * Getter customerId
     * @return {CustomerId}
     */
    public get customerId(): CustomerId {
        return this._customerId;
    }

    /**
     * Getter recipeId
     * @return {RecipeId}
     */
    public get recipeId(): RecipeId {
        return this._recipeId;
    }
    /**
     * Getter rateValue
     * @return {number}
     */
    public get rateValue(): number | undefined {
        return this._rateValue;
    }

    /**
     * Getter comment
     * @return {string}
     */
    public get comment(): string | undefined {
        return this._comment;
    }

    /**
     * Setter customerId
     * @param {CustomerId} value
     */
    public set customerId(value: CustomerId) {
        this._customerId = value;
    }

    /**
     * Setter recipeId
     * @param {RecipeId} value
     */
     public set recipeId(value: RecipeId) {
        this._recipeId = value;
    }

    /**
     * Setter rateValue
     * @param {number} value
     */
    public set rateValue(value: number | undefined) {
        this._rateValue = value;
    }

    /**
     * Setter comment
     * @param {string} value
     */
    public set comment(value: string | undefined) {
        this._comment = value;
    }
}
