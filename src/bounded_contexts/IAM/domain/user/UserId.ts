import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class UserId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
