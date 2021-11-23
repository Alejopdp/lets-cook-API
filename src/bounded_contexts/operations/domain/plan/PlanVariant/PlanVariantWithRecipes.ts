// import { logger } from "../../../../../../config";
// import { PlanSku } from "../PlanSku";
// import { PlanVariant } from "./PlanVariant";
// import { PlanVariantAttribute } from "./PlanVariantAttribute";
// import { PlanVariantId } from "./PlanVariantId";

// export class PlanVariantWithRecipe extends PlanVariant {

//     constructor(
//         numberOfPersons: number,
//         numberOfRecipes: number,
//         sku: PlanSku,
//         name: string,
//         price: number,
//         priceWithOffer: number,
//         attributes: PlanVariantAttribute[],
//         description: string,
//         isDefault: boolean,
//         isDeleted: boolean,
//         id?: PlanVariantId
//     ) {
//         super(sku, name, price, attributes, description, isDefault, isDeleted, priceWithOffer, id);

//         if (numberOfPersons < 1) throw new Error("Hay que ingresar por lo menos 1 persona");
//         if (numberOfRecipes < 1) throw new Error("Hay que ingresar por lo menos 1 receta");
//     }

//     public getConcatenatedAttributesAsString(): string {
//         return this.numberOfPersons.toString() + this.numberOfRecipes.toString() + super.getConcatenatedAttributesAsString();
//     }

//     public getLabel(): string {
//         return this.description || `${this.numberOfRecipes} recetas para ${this.numberOfPersons} personas`;
//     }

//     public getLabelWithPrice(): string {
//         return `${this.getLabel()} / ${this.getPaymentPrice()} €`;
//     }
//     public getServingsQuantity(): number {
//         return this.numberOfPersons * this.numberOfRecipes;
//     }

//     public getNumberOfRecipes(): number {
//         super()
//     }
// }
