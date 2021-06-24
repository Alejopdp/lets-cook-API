import { Customer } from "../../../domain/customer/Customer";
import { Coupon } from "../../../domain/cupons/Cupon";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer as MongooseCustomer } from "../../../../../infraestructure/mongoose/models";
import { customerMapper } from "../../../mappers/customerMapper";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { CustomerId } from "../../../domain/customer/CustomerId";

export class MongooseCustomerRepository implements ICustomerRepository {
    public async save(customer: Customer): Promise<void> {
        const customerDb = customerMapper.toPersistence(customer);
        // console.log("Test: ", shippingDb)
        if (await MongooseCustomer.exists({ _id: customer.id.value })) {
            console.log("Test: ", customer.id.value, customerDb, await MongooseCustomer.exists({ _id: customer.id.value }));
            let test = await MongooseCustomer.updateOne(
                { _id: customer.id.value },
                {
                    $set: {
                        email: customerDb.email,
                        isEmailVerified: customerDb.isEmailVerified,
                        password: customerDb.password,
                        state: customerDb.state,
                        codeToRecoverPassword: customerDb.codeToRecoverPassword,
                    },
                }
            );
        } else {
            console.log(customerDb);
            await MongooseCustomer.create(customerDb);
        }
    }

    public async findByEmail(email: string): Promise<Customer | undefined> {
        const customerDb = await MongooseCustomer.findOne({ email, deletionFlag: false });

        return !!customerDb ? customerMapper.toDomain(customerDb) : undefined;
    }

    public async isEmailVerified(email: string): Promise<boolean> {
        let emailFound: any = await MongooseCustomer.find({ email: email });
        return emailFound.length > 0 ? true : false;
    }

    public async findById(id: CustomerId): Promise<Customer | undefined> {
        const customerDb = await MongooseCustomer.findById(id.value);

        return !!customerDb ? customerMapper.toDomain(customerDb) : undefined;
    }

    // public async findBy(conditions: any): Promise<ShippingZone[]> {
    //     const couponsDb = await MongooseShippingZone.find({ ...conditions, deletionFlag: false });
    //     return couponsDb.map((raw: any) => shippingMapper.toDomain(raw));
    // }

    // public async delete(shippingId: ShippingZoneId): Promise<void> {
    //     await MongooseShippingZone.updateOne({ _id: shippingId.value }, { $set: { deletionFlag: true } });
    // }
}
