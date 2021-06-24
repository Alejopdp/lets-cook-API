import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class OrderId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
