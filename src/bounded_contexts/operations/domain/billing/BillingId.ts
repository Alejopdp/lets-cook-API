import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class BillingId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
