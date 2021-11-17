import { Ingredient } from "../../../domain/ingredient/ingredient";
import { Ingredient as IngredientModel } from "../../../../../infraestructure/mongoose/models";
import { IIngredientRepository } from "./IIngredientRepository";
import { ingredientMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";

export class MongooseIngredientRepository implements IIngredientRepository {
    public async save(ingredient: Ingredient, locale: Locale = Locale.es): Promise<void> {
        const ingredientToSave = ingredientMapper.toPersistence(ingredient, locale);
        const exists: boolean = await IngredientModel.exists({ _id: ingredientToSave._id });

        if (exists) {
            const nameLocaleKey = `name.${locale}`;

            await IngredientModel.updateOne(
                { _id: ingredient.id.value },
                {
                    $set: {
                        [nameLocaleKey]: ingredientToSave.name[locale],
                    },
                }
            );
        } else {
            await IngredientModel.create(ingredientToSave);
        }
    }

    public async bulkSave(ingredients: Ingredient[]): Promise<void> {
        const ingredientsToSave = ingredients.map((ingredient) => ingredientMapper.toPersistence(ingredient));

        await IngredientModel.create(ingredientsToSave);
    }

    public async updateMany(ingredients: Ingredient[], locale: Locale = Locale.es): Promise<void> {
        // const ingredientsToSave = ingredients.map((ingredient) => ingredientMapper.toPersistence(ingredient));
        // const nameLocaleKey = `name.${locale}`;
        // for (let ingredient of )
        // await IngredientModel.updateMany({$set: {
        //     [nameLocaleKey]: name[locale],
        // },})
    }

    public async findAll(locale: Locale = Locale.es): Promise<Ingredient[]> {
        return await this.findBy({});
    }

    public async findAllByName(names: string[], locale: Locale = Locale.es): Promise<Ingredient[]> {
        const nameLocaleKey = `name.${locale}`;

        return await this.findBy({ [nameLocaleKey]: names });
    }

    public async findByName(name: string, locale: Locale = Locale.es): Promise<Ingredient | undefined> {
        const nameLocaleKey = `name.${locale}`;
        const ingredientDb = await IngredientModel.findOne({ [nameLocaleKey]: name });

        return ingredientDb ? ingredientMapper.toDomain(ingredientDb) : undefined;
    }

    public async findBy(conditions: any, locale: Locale = Locale.es): Promise<Ingredient[]> {
        const ingredientsDb = await IngredientModel.find({ ...conditions, deletionFlag: false });

        return ingredientsDb.map((raw: any) => ingredientMapper.toDomain(raw, locale));
    }

    public async delete(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
