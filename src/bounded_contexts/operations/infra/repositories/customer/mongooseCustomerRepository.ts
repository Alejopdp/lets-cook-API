import { Customer } from "../../../domain/customer/Customer";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer as MongooseCustomer } from "../../../../../infraestructure/mongoose/models";
import { customerMapper } from "../../../mappers/customerMapper";
import { CustomerId } from "../../../domain/customer/CustomerId";

export class MongooseCustomerRepository implements ICustomerRepository {
    public async save(customer: Customer): Promise<void> {
        const customerDb = customerMapper.toPersistence(customer);
        if (await MongooseCustomer.exists({ _id: customer.id.value })) {
            await MongooseCustomer.updateOne(
                { _id: customer.id.value },
                {
                    $set: {
                        email: customerDb.email,
                        isEmailVerified: customerDb.isEmailVerified,
                        password: customerDb.password,
                        state: customerDb.state,
                        codeToRecoverPassword: customerDb.codeToRecoverPassword,
                        shippingAddress: customerDb.shippingAddress,
                        billingAddress: customerDb.billingAddress,
                        paymentMethods: customerDb.paymentMethods,
                        personalInfo: customerDb.personalInfo,
                        receivedOrdersQuantity: customerDb.receivedOrdersQuantity,
                        friendCode: customerDb.friendCode,
                        shopifyReceivedOrdersQuantity: customerDb.shopifyReceivedOrdersQuantity,
                        firstOrderDate: customerDb.firstOrderDate,
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

    public async findByIdList(ids: CustomerId[]): Promise<Customer[]> {
        return await this.findBy({ _id: { $in: ids.map((id) => id.value) } });
    }

    public async findAll(): Promise<Customer[]> {
        return await this.findBy({});
    }

    public async findByName(name: string): Promise<Customer[]> {
        return await this.findBy({ "personalInfo.name": name });
    }

    public async findBy(conditions: any): Promise<Customer[]> {
        const customerDb = await MongooseCustomer.find({ ...conditions, deletionFlag: false });

        return customerDb.map((raw: any) => customerMapper.toDomain(raw));
    }

    public async findByIdOrThrow(customerId: CustomerId): Promise<Customer> {
        const customer: Customer | undefined = await this.findById(customerId);

        if (!!!customer) throw new Error("El cliente ingresado no existe");

        return customer;
    }

    public async countCustomersWithFriendCode(): Promise<number> {
        return await MongooseCustomer.count({ friendCode: { $ne: null } });
    }

    public async updateMany(customers: Customer[]): Promise<void> {
        for (let customer of customers) {
            await this.save(customer);
        }
    }

    public async delete(customerId: CustomerId): Promise<void> {
        await MongooseCustomer.updateOne({ _id: customerId.value }, { $set: { deletionFlag: true } });
    }
}
