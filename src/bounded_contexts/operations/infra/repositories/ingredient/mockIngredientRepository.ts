import { Ingredient } from "../../../domain/ingredient/ingredient";
import { IIngredientRepository } from "./IIngredientRepository";

export class MockIngredientRepository implements IIngredientRepository {
    private _database: Ingredient[];

    constructor(database: Ingredient[]) {
        this._database = database;
    }

    public async save(ingredient: Ingredient): Promise<void> {
        const filtered = this.database.filter((i) => !i.equals(ingredient));
        this.database = [...filtered, ingredient];
    }

    public async findByName(name: string): Promise<Ingredient | undefined> {
        return this.database.find((i) => i.name === name);
    }

    public async findAll(): Promise<Ingredient[]> {
        return this.database;
    }

    public async findBy(conditions: any): Promise<Ingredient[]> {
        throw new Error("Method not implemented.");
    }

    public async delete(name: string): Promise<void> {
        this.database = this.database.filter((i) => i.name !== name);
    }

    /**
     * Getter database
     * @return {Ingredient[]}
     */
    public get database(): Ingredient[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Ingredient[]} value
     */
    public set database(value: Ingredient[]) {
        this._database = value;
    }
}
