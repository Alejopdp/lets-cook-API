import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { IValueObject } from "../../../../core/domain/ValueObject";

export class RecipeId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
