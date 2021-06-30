import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class RecipeRatingId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
