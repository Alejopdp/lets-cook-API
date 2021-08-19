import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class IngredientId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
