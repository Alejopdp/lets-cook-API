import { Mapper } from "../../../core/infra/Mapper";
import { Address } from "../domain/address/Address";
import { AddressId } from "../domain/address/AddressId";
import { IPreferredDeliveryTime } from "../domain/customer/preferredDeliveryTime/IPreferredDeliveryTime";
import { PreferredDeliveryTimeFactory } from "../domain/customer/preferredDeliveryTime/preferredDeliveryTimeFactory";

export class AddressMapper implements Mapper<Address, any> {
    public toDomain(raw: any): Address {
        const preferredDeliveryTime: IPreferredDeliveryTime | undefined = raw.deliveryTime
            ? PreferredDeliveryTimeFactory.createDeliveryTime(raw.deliveryTime)
            : undefined;

        return new Address(
            raw.latitude,
            raw.longitude,
            raw.addressName,
            raw.addressFullName,
            raw.addressDetails,
            raw.city,
            raw.province,
            raw.country,
            raw.postalCode,
            preferredDeliveryTime,
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
            deliveryTime: t.deliveryTime?.value(),
            _id: t.id.value,
            city: t.city,
            province: t.province,
            country: t.country,
            postalCode: t.postalCode
        };
    }
}
