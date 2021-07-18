import { Mapper } from "../../../core/infra/Mapper";
import { Address } from "../domain/address/Address";
import { AddressId } from "../domain/address/AddressId";

export class AddressMapper implements Mapper<Address> {
    public toDomain(raw: any): Address {
        return new Address(
            raw.latitude,
            raw.longitude,
            raw.addressName,
            raw.addressFullName,
            raw.addressDetails,
            raw.deliveryTime,
            new AddressId(raw._id)
        );
    }
    public toPersistence(t: Address): any {
        return {
            latitude: t.latitude,
            longitude: t.longitude,
            addressName: t.name,
            addressFullName: t.fullName,
            addressDetails: t.details,
            deliveryTime: t.deliveryTime,
            _id: t.id.value,
        };
    }
}
