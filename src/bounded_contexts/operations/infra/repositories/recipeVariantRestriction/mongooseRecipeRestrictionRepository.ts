import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantRestriction as RecipeVariantRestrictionModel } from "../../../../../infraestructure/mongoose/models";
import { recipeRestrictionMapper } from "../../../mappers";
import { IRecipeRestrictionRepository } from "./IRecipeRestrictionRepository";
import { Locale } from "../../../domain/locale/Locale";

export class MongooseRecipeVariantRestrictionRepository implements IRecipeRestrictionRepository {
    public async save(recipeVariantRestriction: RecipeVariantRestriction): Promise<void> {
        const recipeRestrictionToSave = recipeRestrictionMapper.toPersistence(recipeVariantRestriction);

        if (await RecipeVariantRestrictionModel.exists({ _id: recipeVariantRestriction.id.value })) {
            await RecipeVariantRestrictionModel.updateOne({ _id: recipeVariantRestriction.id.value }, recipeRestrictionToSave);
        } else {
            await RecipeVariantRestrictionModel.create(recipeRestrictionToSave);
        }
    }

    public async bulkSave(recipeVariantRestrictions: RecipeVariantRestriction[]): Promise<void> {
        const recipeVariantRestrictionsToSave = recipeVariantRestrictions.map((restriction) =>
            recipeRestrictionMapper.toPersistence(restriction)
        );

        await RecipeVariantRestrictionModel.create(recipeVariantRestrictionsToSave);
    }

    public async findAll(): Promise<RecipeVariantRestriction[]> {
        return await this.findBy({});
    }

    public async findAllByValue(value: string): Promise<RecipeVariantRestriction[]> {
        return await this.findBy({ value });
    }

    public async findById(recipeRestrictionId: RecipeRestrictionId, locale: Locale): Promise<RecipeVariantRestriction | undefined> {
        const restrictionDb = await RecipeVariantRestrictionModel.findById(recipeRestrictionId.value);

        return restrictionDb ? recipeRestrictionMapper.toDomain(restrictionDb) : undefined;
    }

    public async findByIdOrThrow(recipeRestrictionId: RecipeRestrictionId, locale: Locale = Locale.es): Promise<RecipeVariantRestriction> {
        const restriction: RecipeVariantRestriction | undefined = await this.findById(recipeRestrictionId, locale);
        if (!!!restriction) throw new Error("La restricción ingresada no es válida");

        return restriction;
    }

    public async findBy(conditions: any): Promise<RecipeVariantRestriction[]> {
        const restrictionsDb = await RecipeVariantRestrictionModel.find({ ...conditions, deletionFlag: false });

        return restrictionsDb.map((restriction: any) => recipeRestrictionMapper.toDomain(restriction));
    }

    public async delete(recipeId: RecipeRestrictionId): Promise<void> {
        await RecipeVariantRestrictionModel.updateOne({ _id: recipeId.value }, { deletionFlag: true });
    }
}
