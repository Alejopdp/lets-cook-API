import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class RateId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}