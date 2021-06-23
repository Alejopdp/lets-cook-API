import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class SubscriptionId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
