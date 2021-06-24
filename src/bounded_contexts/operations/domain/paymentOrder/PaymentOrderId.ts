import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class PaymentOrderId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
