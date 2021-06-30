import { UniqueEntityID } from "../../../../../core/domain/UniqueEntityID";

export class PaymentMethodId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
