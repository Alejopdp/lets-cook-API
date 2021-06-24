import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class CustomerId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
