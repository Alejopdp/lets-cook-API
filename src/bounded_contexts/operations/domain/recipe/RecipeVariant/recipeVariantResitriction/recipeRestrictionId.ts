import { UniqueEntityID } from "../../../../../../core/domain/UniqueEntityID";

export class RecipeRestrictionId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
