import { Entity } from "../../../../core/domain/Entity";
import { CustomerId } from "../customer/CustomerId";
import { Order } from "../order/Order";
import { Recipe } from "../recipe/Recipe";
import { RecipeRatingId } from "./RecipeRatingId";

export class RecipeRating extends Entity<RecipeRating> {
    private _recipe: Recipe;
    private _customerId: CustomerId;
    private _order: Order;
    private _qtyDelivered: number;
    private _rating?: number;
    private _comment?: string;

    constructor(
        recipe: Recipe,
        customerId: CustomerId,
        order: Order,
        qtyDelivered: number,
        rating?: number,
        comment?: string,
        id?: RecipeRatingId
    ) {
        super(id);
        this._recipe = recipe;
        this._customerId = customerId;
        this._rating = rating;
        this._comment = comment;
        this._order = order;
        this._qtyDelivered = qtyDelivered;
    }

    /**
     * Getter recipe
     * @return {Recipe}
     */
    public get recipe(): Recipe {
        return this._recipe;
    }

    /**
     * Getter customerId
     * @return {CustomerId}
     */
    public get customerId(): CustomerId {
        return this._customerId;
    }

    /**
     * Getter rating
     * @return {number | undefined}
     */
    public get rating(): number | undefined {
        return this._rating;
    }

    /**
     * Getter comment
     * @return {string | undefined}
     */
    public get comment(): string | undefined {
        return this._comment;
    }

    /**
     * Getter order
     * @return {Order}
     */
    public get order(): Order {
        return this._order;
    }

    /**
     * Getter qtyDelivered
     * @return {number}
     */
    public get qtyDelivered(): number {
        return this._qtyDelivered;
    }

    /**
     * Setter order
     * @param {Order} value
     */
    public set order(value: Order) {
        this._order = value;
    }

    /**
     * Setter qtyDelivered
     * @param {number} value
     */
    public set qtyDelivered(value: number) {
        this._qtyDelivered = value;
    }

    /**
     * Setter recipe
     * @param {Recipe} value
     */
    public set recipe(value: Recipe) {
        this._recipe = value;
    }

    /**
     * Setter customerId
     * @param {CustomerId} value
     */
    public set customerId(value: CustomerId) {
        this._customerId = value;
    }

    /**
     * Setter rating
     * @param {number | undefined} value
     */
    public set rating(value: number | undefined) {
        this._rating = value;
    }

    /**
     * Setter comment
     * @param {string | undefined} value
     */
    public set comment(value: string | undefined) {
        this._comment = value;
    }
}
