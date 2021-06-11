import { Ingredient } from "../../../domain/ingredient/ingredient";
import { Ingredient as IngredientModel } from "../../../../../infraestructure/mongoose/models";
import { IIngredientRepository } from "./IIngredientRepository";
import { ingredientMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";

export class MongooseIngredientRepository implements IIngredientRepository {
    public async save(ingredient: Ingredient): Promise<void> {
        const ingredientToSave = ingredientMapper.toPersistence(ingredient);

        if (await IngredientModel.exists({ name: ingredient.name })) {
            await IngredientModel.updateOne({ name: ingredient.name }, ingredientToSave);
        } else {
            await IngredientModel.create(ingredientToSave);
        }
    }

    public async bulkSave(ingredients: Ingredient[]): Promise<void> {
        const ingredientsToSave = ingredients.map((ingredient) => ingredientMapper.toPersistence(ingredient));

        await IngredientModel.create(ingredientsToSave);
    }

    public async findAll(): Promise<Ingredient[]> {
        return await this.findBy({});
    }

    public async findAllByName(names: string[]): Promise<Ingredient[]> {
        return await this.findBy({ name: names });
    }

    public async findByName(name: string): Promise<Ingredient | undefined> {
        const ingredientDb = await IngredientModel.findOne({ name });

        return ingredientDb ? ingredientMapper.toDomain(ingredientDb) : undefined;
    }

    public async findBy(conditions: any, locale?: Locale): Promise<Ingredient[]> {
        const ingredientsDb = await IngredientModel.find({ ...conditions, deletionFlag: false });

        return ingredientsDb.map((raw: any) => ingredientMapper.toDomain(raw, locale));
    }

    public async delete(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
