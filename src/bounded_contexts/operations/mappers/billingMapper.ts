import { Mapper } from "../../../core/infra/Mapper";
import { Billing } from "../domain/billing/Billing";
import { BillingId } from "../domain/billing/BillingId";

export class BillingMapper implements Mapper<Billing, any> {
    public toDomain(raw: any): Billing {
        return new Billing(raw.latitude, raw.longitude, raw.addressName, raw.customerName, raw.addressDetails, raw.city, raw.province, raw.postalCode, raw.country, raw.identification, new BillingId(raw._id));
    }
    public toPersistence(t: Billing): any {
        return {
            latitude: t.latitude,
            longitude: t.longitude,
            addressName: t.addressName,
            customerName: t.customerName,
            addressDetails: t.details,
            identification: t.identification,
            _id: t.id.value,
            city: t.city,
            province: t.province,
            postalCode: t.postalCode,
            country: t.country
        };
    }
}
