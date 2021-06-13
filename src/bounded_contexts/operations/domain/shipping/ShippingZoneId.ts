import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class ShippingZoneId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
