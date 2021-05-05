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

export class Recipe extends Entity<Recipe> {
    private _recipeGeneralData: RecipeGeneralData;
    private _recipeVaraints: RecipeVariant[];
    private _recipeImageTags: RecipeTag[];
    private _recipeBackOfficeTags: RecipeTag[];
    private _recipeNutritionalData: RecipeNutritionalData;
    private _availableWeeks: Week[];
    private _availableMonths: Month[];
    private _relatedPlans: PlanId[];

    constructor(
        recipeGeneralData: RecipeGeneralData,
        recipeVaraints: RecipeVariant[],
        recipeImageTags: RecipeTag[],
        recipeBackOfficeTags: RecipeTag[],
        recipeNutritionalData: RecipeNutritionalData,
        availableWeeks: Week[],
        availableMonths: Month[],
        relatedPlans: PlanId[],
        id?: RecipeId
    ) {
        super(id);
        this._recipeGeneralData = recipeGeneralData;
        this._recipeVaraints = recipeVaraints;
        this._recipeImageTags = _.uniqBy(recipeImageTags, (tag) => tag.name);
        this._recipeBackOfficeTags = _.uniqBy(recipeBackOfficeTags, (tag) => tag.name);
        this._recipeNutritionalData = recipeNutritionalData;
        this._availableWeeks = availableWeeks;
        this._availableMonths = availableMonths;
        this._relatedPlans = relatedPlans;
    }

    /**
     * Getter recipeGeneralData
     * @return {RecipeGeneralData}
     */
    public get recipeGeneralData(): RecipeGeneralData {
        return this._recipeGeneralData;
    }

    /**
     * Getter recipeVaraints
     * @return {RecipeVariant[]}
     */
    public get recipeVaraints(): RecipeVariant[] {
        return this._recipeVaraints;
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
     * Setter recipeGeneralData
     * @param {RecipeGeneralData} value
     */
    public set recipeGeneralData(value: RecipeGeneralData) {
        this._recipeGeneralData = value;
    }

    /**
     * Setter recipeVaraints
     * @param {RecipeVariant[]} value
     */
    public set recipeVaraints(value: RecipeVariant[]) {
        this._recipeVaraints = value;
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
}
