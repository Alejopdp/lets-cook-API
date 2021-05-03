import { UniqueEntityID } from "../../../../../core/domain/UniqueEntityID";

export class RecipeVariantId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
