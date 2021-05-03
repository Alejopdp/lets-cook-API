import { IValueObject } from "../../../../../core/domain/ValueObject";
import { NutritionalItem } from "./NutritionalItem";

export class RecipeNutritionalData implements IValueObject<RecipeNutritionalData> {
    private _nutritionalItems: NutritionalItem[];

    constructor(nutritionalItems: NutritionalItem[]) {
        this._nutritionalItems = nutritionalItems;
    }

    public equals(aRecipeNutrionalData: RecipeNutritionalData): boolean {
        return this.nutritionalItems.every((ni) => aRecipeNutrionalData.nutritionalItems.some((ni2) => ni2.equals(ni)));
    }

    private addNutritionalItem(aNutritionalItem: NutritionalItem): void {
        if (this.nutritionalItems.some((ni) => ni.equals(aNutritionalItem))) return;

        this.nutritionalItems = [...this.nutritionalItems, aNutritionalItem];
    }

    private removeNutrinionalItem(aNutritionalItem: NutritionalItem): void {
        this.nutritionalItems = this.nutritionalItems.filter((ni) => !ni.equals(aNutritionalItem));
    }

    /**
     * Getter nutritionalItems
     * @return {NutritionalItem[]}
     */
    public get nutritionalItems(): NutritionalItem[] {
        return this._nutritionalItems;
    }

    /**
     * Setter nutritionalItems
     * @param {NutritionalItem[]} value
     */
    public set nutritionalItems(value: NutritionalItem[]) {
        this._nutritionalItems = value;
    }
}
