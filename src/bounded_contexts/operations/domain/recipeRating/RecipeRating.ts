import { Entity } from "../../../../core/domain/Entity";
import { CustomerId } from "../customer/CustomerId";
import { Recipe } from "../recipe/Recipe";
import { RecipeRatingId } from "./RecipeRatingId";

export class RecipeRating extends Entity<RecipeRating> {
    private _recipe: Recipe;
    private _customerId: CustomerId;
    private _qtyDelivered: number;
    private _lastShippingDate: Date;
    private _beforeLastShippingDate: Date;
    private _shippingDates: Date[];
    private _rating?: number;
    private _comment?: string;

    constructor(
        recipe: Recipe,
        customerId: CustomerId,
        qtyDelivered: number,
        lastShippingDate: Date,
        beforeLastShippingDate: Date,
        shippingDates: Date[],
        rating?: number,
        comment?: string,
        id?: RecipeRatingId
    ) {
        super(id);
        this._recipe = recipe;
        this._customerId = customerId;
        this._rating = rating;
        this._lastShippingDate = lastShippingDate;
        this._beforeLastShippingDate = beforeLastShippingDate;
        this._shippingDates = shippingDates;
        this._comment = comment;
        this._qtyDelivered = qtyDelivered;
    }

    public updateRating(rating: number, comment: string): void {
        if (rating > 5) throw new Error("La calificación no puede ser mayor a 5");
        // TO DO: Agregar validación para que no se pueda ratear si shippingDate > today

        this.rating = rating;
        this.comment = comment;
    }

    public addOneDelivery(lastShippingDate: Date, beforeLastShippingDate?: Date): void {
        this.shippingDates.push(lastShippingDate);
    }

    public removeOneDelivery(shippingDate: Date): void {
        const today = new Date();
        if (shippingDate.getTime() < today.getTime()) return;
        var idx = this.shippingDates.findIndex((date) => date.getTime() === shippingDate.getTime());
        this.shippingDates.splice(idx, 1);
    }

    public getQtyDelivered(): number {
        return this.shippingDates.length;
    }

    public isRateable(queryDate: Date): boolean {
        const firstShippingDate = this.getFirstShippingDate();
        if (!firstShippingDate) return false;

        return this.getQtyDelivered() >= 0 && queryDate.getTime() > firstShippingDate.getTime();
    }

    public isRated(): boolean {
        return !!this.rating && this.rating > 0;
    }

    public getLastShippingDate(): Date | undefined {
        if (this.shippingDates.length === 0) return undefined;
        const baseDate = new Date(1970, 1);

        return this.shippingDates.reduce(function (a, b) {
            return a > b ? a : b;
        }, baseDate);
    }

    public getFirstShippingDate(): Date | undefined {
        if (this.shippingDates.length === 0) return undefined;
        return this.shippingDates.sort((a, b) => a.getTime() - b.getTime())[0];
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
     * Getter qtyDelivered
     * @return {number}
     */
    public get qtyDelivered(): number {
        return this._qtyDelivered;
    }

    /**
     * Getter lastShippingDate
     * @return {Date}
     */
    public get lastShippingDate(): Date {
        return this._lastShippingDate;
    }

    /**
     * Getter beforeLastShippingDate
     * @return {Date}
     */
    public get beforeLastShippingDate(): Date {
        return this._beforeLastShippingDate;
    }

    /**
     * Getter shippingDates
     * @return {Date[]}
     */
    public get shippingDates(): Date[] {
        return this._shippingDates;
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

    /**
     * Setter lastShippingDate
     * @param {Date} value
     */
    public set lastShippingDate(value: Date) {
        this._lastShippingDate = value;
    }

    /**
     * Setter beforeLastShippingDate
     * @param {Date} value
     */
    public set beforeLastShippingDate(value: Date) {
        this._beforeLastShippingDate = value;
    }

    /**
     * Setter shippingDates
     * @param {Date[]} value
     */
    public set shippingDates(value: Date[]) {
        this._shippingDates = value;
    }
}
