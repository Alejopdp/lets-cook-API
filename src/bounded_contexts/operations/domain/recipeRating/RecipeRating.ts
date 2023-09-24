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
    private _dontRate: boolean;
    private _ratingDate?: Date;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(
        recipe: Recipe,
        customerId: CustomerId,
        qtyDelivered: number,
        lastShippingDate: Date,
        beforeLastShippingDate: Date,
        shippingDates: Date[],
        dontRate: boolean,
        rating?: number,
        comment?: string,
        id?: RecipeRatingId,
        ratingDate?: Date,
        createdAt?: Date,
        updatedAt?: Date

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
        this._dontRate = dontRate;
        this._ratingDate = ratingDate;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
    }

    public updateRating(rating: number, comment: string, ratingDate: Date): void {
        if (rating > 5) throw new Error("La calificación no puede ser mayor a 5");
        // TO DO: Agregar validación para que no se pueda ratear si shippingDate > today

        this.rating = rating;
        this.comment = comment;
        this.dontRate = false
        if (!this.ratingDate) this.ratingDate = ratingDate;
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
        const lastShippedDate = this.getLastShippedDate(queryDate);
        if (!lastShippedDate) return 0;


        const qtyOfDeliveriesBeforeLastShippingDateAt13 = this.shippingDates.filter((date) => date.getTime() <= lastShippedDate.getTime()).length;

        return qtyOfDeliveriesBeforeLastShippingDateAt13;
    }

    public isRateable(queryDate: Date): boolean {
        const firstShippingDate = this.getFirstShippingDate();
        if (!firstShippingDate) return false;

        const firstShippingDateAt13 = new Date(firstShippingDate.getFullYear(), firstShippingDate.getMonth(), firstShippingDate.getDate(), 13, 0, 0, 0);
        const isQueryingAfter13AndItHasAtLeastOneDelivery = queryDate.getTime() >= firstShippingDateAt13.getTime()

        return isQueryingAfter13AndItHasAtLeastOneDelivery
    }

    public isRated(): boolean {
        return !!this.rating && this.rating > 0;
    }

    public getLastShippedDate(queryDate: Date): Date | undefined {
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

    public rateLater(): void {
        if (this.isRated()) return
        this.dontRate = true;
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
     * Getter dontRate
     * @return {boolean}
     */
    public get dontRate(): boolean {
        return this._dontRate;
    }

    /**
 * Getter ratingDate
 * @return {Date | undefined}
 */
    public get ratingDate(): Date | undefined {
        return this._ratingDate;
    }


    /**
     * Getter createdAt
     * @return {Date}
     */
    public get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * Getter updatedAt
     * @return {Date}
     */
    public get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Setter createdAt
     * @param {Date} value
     */
    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    /**
     * Setter updatedAt
     * @param {Date} value
     */
    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }


    /**
     * Setter ratingDate
     * @return {Date | undefined}
     */
    public set ratingDate(ratingDate: Date | undefined) {
        this._ratingDate = ratingDate
    }


    /**
     * Setter dontRate
     * @param {boolean} value
     */
    public set dontRate(value: boolean) {
        this._dontRate = value;
    }

    /**
     * Setter recipeRating
     * @param {Date | undefined} value
     */
    public set recipeRating(value: Date | undefined) {
        this.recipeRating = value;
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
