import { logger } from "../../../../../../config";
import { PlanSku } from "../PlanSku";
import { PlanVariant } from "./PlanVariant";
import { PlanVariantAttribute } from "./PlanVariantAttribute";
import { PlanVariantId } from "./PlanVariantId";

export class PlanVariantWithRecipe extends PlanVariant {
    private _numberOfPersons: number;
    private _numberOfRecipes: number;

    constructor(
        numberOfPersons: number,
        numberOfRecipes: number,
        sku: PlanSku,
        name: string,
        price: number,
        priceWithOffer: number,
        attributes: PlanVariantAttribute[],
        description: string,
        isDefault: boolean,
        isDeleted: boolean,
        id?: PlanVariantId
    ) {
        super(sku, name, price, attributes, description, isDefault, isDeleted, priceWithOffer, id);

        if (numberOfPersons < 1) throw new Error("Hay que ingresar por lo menos 1 persona");
        if (numberOfRecipes < 1) throw new Error("Hay que ingresar por lo menos 1 receta");

        this._numberOfPersons = numberOfPersons;
        this._numberOfRecipes = numberOfRecipes;
    }

    public getConcatenatedAttributesAsString(): string {
        return this.numberOfPersons.toString() + this.numberOfRecipes.toString() + super.getConcatenatedAttributesAsString();
    }

    public getLabel(): string {
        return this.description || `${this.numberOfRecipes} recetas para ${this.numberOfPersons} personas`;
    }

    public getLabelWithPrice(): string {
        return `${this.getLabel()} / ${this.getPaymentPrice()} €`;
    }
    public getServingsQuantity(): number {
        return this.numberOfPersons * this.numberOfRecipes;
    }

    public getNumberOfRecipes(): number {
        return this.numberOfRecipes;
    }

    /**
     * Getter numberOfPersons
     * @return {number}
     */
    public get numberOfPersons(): number {
        return this._numberOfPersons;
    }

    /**
     * Getter numberOfRecipes
     * @return {number}
     */
    public get numberOfRecipes(): number {
        return this._numberOfRecipes;
    }

    /**
     * Setter numberOfPersons
     * @param {number} value
     */
    public set numberOfPersons(value: number) {
        this._numberOfPersons = value;
    }

    /**
     * Setter numberOfRecipes
     * @param {number} value
     */
    public set numberOfRecipes(value: number) {
        this._numberOfRecipes = value;
    }
}
