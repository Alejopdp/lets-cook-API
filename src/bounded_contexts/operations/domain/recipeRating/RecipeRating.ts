import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
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
        const alreadyHasThisShippingDate = this.shippingDates.some((date) => MomentTimeService.isSameDay(date, lastShippingDate));
        if (alreadyHasThisShippingDate) return;
        this.shippingDates.push(lastShippingDate);
    }

    public removeOneDelivery(shippingDate: Date): void {
        this.shippingDates = this.shippingDates.filter((date) => !MomentTimeService.isSameDay(date, shippingDate))
    }

    public getQtyDelivered(queryDate: Date): number {
        const lastShippingDate = this.getLastShippingDate(queryDate);
        if (!lastShippingDate) return 0;

        const lastShippingDateAt13 = new Date(lastShippingDate.getFullYear(), lastShippingDate.getMonth(), lastShippingDate.getDate(), 13, 0, 0, 0);

        return this.shippingDates.filter((date) => date.getTime() <= lastShippingDateAt13.getTime()).length;
    }

    public isRateable(queryDate: Date): boolean {
        const firstShippingDate = this.getFirstShippingDate();
        if (!firstShippingDate) return false;

        const firstShippingDateAt13 = new Date(firstShippingDate.getFullYear(), firstShippingDate.getMonth(), firstShippingDate.getDate(), 13, 0, 0, 0);

        return this.getQtyDelivered(queryDate) >= 0 && queryDate.getTime() >= firstShippingDateAt13.getTime();
    }

    public isRated(): boolean {
        return !!this.rating && this.rating > 0;
    }

    public getLastShippingDate(queryDate: Date): Date | undefined {
        const lastShippingDate = this.shippingDates
            .filter((date) => {
                const auxShippingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0, 0, 0);
                return auxShippingDate.getTime() <= queryDate.getTime()
            })
            .sort((a, b) => b.getTime() - a.getTime())[0];

        return lastShippingDate;

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
