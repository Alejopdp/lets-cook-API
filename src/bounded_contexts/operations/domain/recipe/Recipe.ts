import { Entity } from "../../../../core/domain/Entity";
import { RecipeGeneralData } from "./RecipeGeneralData/RecipeGeneralData";
import { RecipeId } from "./RecipeId";
import { RecipeNutritionalData } from "./RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "./RecipeTag";
import { RecipeVariant } from "./RecipeVariant/RecipeVariant";
import * as _ from "lodash";
import { Month } from "./Months";
import { Week } from "../week/Week";
import { PlanId } from "../plan/PlanId";
import { RecipeVariantId } from "./RecipeVariant/RecipeVariantId";
import { RecipeVariantRestriction } from "./RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "./RecipeVariant/RecipeVariantSku";

export class Recipe extends Entity<Recipe> {
    private _recipeGeneralData: RecipeGeneralData;
    private _recipeVariants: RecipeVariant[];
    private _recipeImageTags: RecipeTag[];
    private _recipeBackOfficeTags: RecipeTag[];
    private _recipeNutritionalData: RecipeNutritionalData;
    private _availableWeeks: Week[];
    private _availableMonths: Month[];
    private _relatedPlans: PlanId[];
    private _recipeTools: string[];
    private _orderPriority?: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(
        recipeGeneralData: RecipeGeneralData,
        recipeVariants: RecipeVariant[],
        recipeImageTags: RecipeTag[],
        recipeBackOfficeTags: RecipeTag[],
        recipeNutritionalData: RecipeNutritionalData,
        availableWeeks: Week[],
        availableMonths: Month[],
        relatedPlans: PlanId[],
        recipeTools: string[],
        createdAt: Date,
        updatedAt: Date,
        id?: RecipeId,
        orderPriority?: number
    ) {
        if (!Array.isArray(recipeVariants) || recipeVariants.length === 0)
            throw new Error("Es necesario agregar al menos una variante a la receta");
        super(id);
        this._recipeGeneralData = recipeGeneralData;
        this._recipeVariants = recipeVariants;
        this._recipeImageTags = _.uniqBy(recipeImageTags, (tag) => tag.name);
        this._recipeBackOfficeTags = _.uniqBy(recipeBackOfficeTags, (tag) => tag.name);
        this._recipeNutritionalData = recipeNutritionalData;
        this._availableWeeks = availableWeeks;
        this._availableMonths = availableMonths;
        this._relatedPlans = relatedPlans;
        this._recipeTools = recipeTools;
        this._orderPriority = orderPriority;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    public getName(): string {
        return this.recipeGeneralData.name;
    }

    public getMainImageUrl(): string {
        return this.recipeGeneralData.imagesUrls[0];
    }

    public getImagesUrls(): string[] {
        return this.recipeGeneralData.imagesUrls || [];
    }

    public getVariantSkuByVariantsIds(variantIds: RecipeVariantId[]): string {
        const variant: RecipeVariant | undefined = this.recipeVariants.find((variant) => variantIds.some((id) => id.equals(variant.id)));
        if (!!!variant) return "";

        return variant.sku.code;
    }

    public updateWeeks(weeks: Week[]): void {
        this.availableWeeks = weeks;
    }

    public getVariantRestriction(recipeVariantId: RecipeVariantId): RecipeVariantRestriction | undefined {
        return this.recipeVariants.find((variant) => variant.id.equals(recipeVariantId))?.restriction;
    }

    public getVariantRestrictionByVariantSku(variantSku: RecipeVariantSku): RecipeVariantRestriction | undefined {
        return this.recipeVariants.find((variant) => variant.sku.equals(variantSku))?.restriction;
    }

    public getPresentedNutritionalInfo(): { key: string; value: string }[] {
        return this.recipeNutritionalData.nutritionalItems.map((item) => ({ key: item.key, value: item.value, id: item.id }));
    }

    public getDefaultVariantSku(): string {
        return this.recipeVariants[0].sku.code;
    }

    public deleteRecipeVariant(variantSku: RecipeVariantSku): void {
        this.recipeVariants = this.recipeVariants.filter((variant) => !variant.sku.equals(variantSku));
    }

    /**
     * Getter recipeGeneralData
     * @return {RecipeGeneralData}
     */
    public get recipeGeneralData(): RecipeGeneralData {
        return this._recipeGeneralData;
    }

    /**
     * Getter recipeVariants
     * @return {RecipeVariant[]}
     */
    public get recipeVariants(): RecipeVariant[] {
        return this._recipeVariants;
    }

    /**
     * Getter recipeImageTags
     * @return {RecipeTag[]}
     */
    public get recipeImageTags(): RecipeTag[] {
        return this._recipeImageTags;
    }

    /**
     * Getter recipeBackOfficeTags
     * @return {RecipeTag[]}
     */
    public get recipeBackOfficeTags(): RecipeTag[] {
        return this._recipeBackOfficeTags;
    }

    /**
     * Getter recipeNutritionalData
     * @return {RecipeNutritionalData}
     */
    public get recipeNutritionalData(): RecipeNutritionalData {
        return this._recipeNutritionalData;
    }

    /**
     * Getter availableWeeks
     * @return {Week[]}
     */
    public get availableWeeks(): Week[] {
        return this._availableWeeks;
    }

    /**
     * Getter availableMonths
     * @return {Month[]}
     */
    public get availableMonths(): Month[] {
        return this._availableMonths;
    }

    /**
     * Getter relatedPlans
     * @return {PlanId[]}
     */
    public get relatedPlans(): PlanId[] {
        return this._relatedPlans;
    }

    /**
     * Getter orderPriority
     * @return {number | undefined}
     */
    public get orderPriority(): number | undefined {
        return this._orderPriority;
    }

    /**
     * Getter recipeTools
     * @return {string[]}
     */
    public get recipeTools(): string[] {
        return this._recipeTools;
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
     * Setter recipeGeneralData
     * @param {RecipeGeneralData} value
     */
    public set recipeGeneralData(value: RecipeGeneralData) {
        this._recipeGeneralData = value;
    }

    /**
     * Setter recipeVariants
     * @param {RecipeVariant[]} value
     */
    public set recipeVariants(value: RecipeVariant[]) {
        this._recipeVariants = value;
    }

    /**
     * Setter recipeImageTags
     * @param {RecipeTag[]} value
     */
    public set recipeImageTags(value: RecipeTag[]) {
        this._recipeImageTags = value;
    }

    /**
     * Setter recipeBackOfficeTags
     * @param {RecipeTag[]} value
     */
    public set recipeBackOfficeTags(value: RecipeTag[]) {
        this._recipeBackOfficeTags = value;
    }

    /**
     * Setter recipeNutritionalData
     * @param {RecipeNutritionalData} value
     */
    public set recipeNutritionalData(value: RecipeNutritionalData) {
        this._recipeNutritionalData = value;
    }

    /**
     * Setter availableWeeks
     * @param {Week[]} value
     */
    public set availableWeeks(value: Week[]) {
        this._availableWeeks = value;
    }

    /**
     * Setter availableMonths
     * @param {Month[]} value
     */
    public set availableMonths(value: Month[]) {
        this._availableMonths = value;
    }

    /**
     * Setter relatedPlans
     * @param {PlanId[]} value
     */
    public set relatedPlans(value: PlanId[]) {
        this._relatedPlans = value;
    }

    /**
     * Setter recipeTools
     * @param {string[]} value
     */
    public set recipeTools(value: string[]) {
        this._recipeTools = value;
    }

    /**
     * Setter orderPriority
     * @param {number | undefined} value
     */
    public set orderPriority(value: number | undefined) {
        this._orderPriority = value;
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

}
