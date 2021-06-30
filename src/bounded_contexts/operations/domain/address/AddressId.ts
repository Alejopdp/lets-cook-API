import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class AddressId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
