import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { IRecipeRestrictionRepository } from "./IRecipeRestrictionRepository";

export class MockRecipeRestrictionRepository implements IRecipeRestrictionRepository {
    private _database: RecipeVariantRestriction[];

    constructor(database: RecipeVariantRestriction[]) {
        this._database = database;
    }

    public async findAllByValue(value: string): Promise<RecipeVariantRestriction[]> {
        return this.database.filter((r) => r.value === value);
    }

    public async save(recipeRestriction: RecipeVariantRestriction): Promise<void> {
        const filteredDatabase = this.database.filter((r) => !recipeRestriction.equals(r));

        this.database = [...filteredDatabase, recipeRestriction];
    }

    public async findAll(): Promise<RecipeVariantRestriction[]> {
        return this.database;
    }
    public async findById(recipeRestrictionId: RecipeRestrictionId): Promise<RecipeVariantRestriction | undefined> {
        return this.database.find((restriction) => restriction.id.equals(recipeRestrictionId));
    }

    public async findBy(conditions: any): Promise<RecipeVariantRestriction[]> {
        throw new Error("Method not implemented.");
    }
    public async delete(recipeId: RecipeRestrictionId): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Getter database
     * @return {RecipeVariantRestriction[]}
     */
    public get database(): RecipeVariantRestriction[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {RecipeVariantRestriction[]} value
     */
    public set database(value: RecipeVariantRestriction[]) {
        this._database = value;
    }
}
