import { Customer } from "../../../domain/customer/Customer";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer as MongooseCustomer } from "../../../../../infraestructure/mongoose/models";
import { customerMapper } from "../../../mappers/customerMapper";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";
import { WalletMovementLog } from "../../../../../infraestructure/mongoose/models/walletMovementLog";

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
                        wallet: customerDb.wallet,
                    },
                }
            );

            const latestLog = await WalletMovementLog.findOne({ customer: customer.id.toString() }).sort({ createdAt: -1 });
            const latestTimestamp = latestLog ? latestLog.createdAt.getTime() : new Date(0).getTime();
            const newLogs = customer.wallet?.walletMovements.filter((log: any) => log.createdAt.getTime() > latestTimestamp);

            if (newLogs && newLogs.length > 0) {
                await WalletMovementLog.insertMany(newLogs.map((log: any) => ({
                    type: log.type,
                    title: log.title,
                    description: log.description,
                    customer: customer.id.toString()
                })));
            }

        } else {
            await Promise.all([MongooseCustomer.create(customerDb), WalletMovementLog.insertMany(customer.wallet?.walletMovements.map((log: any) => ({
                type: log.type,
                title: log.title,
                description: log.description,
                customer: customer.id.toString()
            })) ?? [])])
        }
    }

    public async findByEmail(email: string): Promise<Customer | undefined> {
        const customerDb = await MongooseCustomer.findOne({
            email: { $regex: `^${email.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}$`, $options: "i" },
            deletionFlag: false,
        });


        if (!customerDb) {
            return undefined;
        }

        if (customerDb.wallet) {
            const logsDb = await WalletMovementLog.find({ customer: customerDb._id }, undefined, { sort: { createdAt: -1 } }).lean();
            customerDb.wallet = {
                //@ts-ignore
                ...customerDb.wallet, walletMovements: logsDb.map((log: any) => ({
                    type: log.type,
                    title: log.title,
                    description: log.description,
                    createdAt: log.createdAt,
                }))
            }
        }

        return customerMapper.toDomain(customerDb);
    }

    public async isEmailVerified(email: string): Promise<boolean> {
        let emailFound: any = await MongooseCustomer.find({ email: email });
        return emailFound.length > 0 ? true : false;
    }

    public async findById(id: CustomerId): Promise<Customer | undefined> {
        const customerDb = await MongooseCustomer.findById(id.value).lean();

        if (!customerDb) {
            return undefined;
        }

        if (customerDb.wallet) {
            const logsDb = await WalletMovementLog.find({ customer: customerDb._id }, undefined, { sort: { createdAt: -1 } }).lean();
            customerDb.wallet = {
                //@ts-ignore
                ...customerDb.wallet, walletMovements: logsDb.map((log: any) => ({
                    type: log.type,
                    title: log.title,
                    description: log.description,
                    createdAt: log.createdAt,
                }))
            }
        }

        return customerMapper.toDomain(customerDb);
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
        const customersDb = await MongooseCustomer.find({ ...conditions, deletionFlag: false }).lean()
        const customerIds = customersDb.map(customer => customer._id);
        const walletMovementLogsDb = await WalletMovementLog.find({ customer: { $in: customerIds } }, undefined, { sort: { createdAt: -1 } }).lean();


        const logsByCustomer = walletMovementLogsDb.reduce((acc: any, log: any) => {
            if (!acc[log.customer]) acc[log.customer] = [];
            acc[log.customer].push(log);
            return acc;
        }, {});

        // Asociar logs a cada cliente
        const customersWithLogs = customersDb.map((customer: any) => !customer.wallet ? ({ ...customer }) : ({
            ...customer,
            wallet: {
                ...customer.wallet,
                walletMovements: logsByCustomer[customer._id] || []
            }
        }));

        return customersWithLogs.map((raw: any) => customerMapper.toDomain(raw));
    }

    public async findByIdOrThrow(customerId: CustomerId): Promise<Customer> {
        const customer: Customer | undefined = await this.findById(customerId);

        if (!!!customer) throw new Error("El cliente ingresado no existe");

        return customer;
    }

    public async countActiveCustomersByWeek(week: Week): Promise<number> {
        const count = await MongooseCustomer.aggregate()
            .project({
                _id: 1,
            })
            .lookup({ from: "Order", localField: "_id", foreignField: "customer", as: "orders" })
            .match({
                $expr: {
                    $gt: [
                        {
                            $size: {
                                $ifNull: [
                                    {
                                        $filter: {
                                            input: "$orders",
                                            as: "order",
                                            cond: { $eq: [{ $getField: { field: "state", input: "order" } }, "ORDER_BILLED"] },
                                        },
                                    },
                                    [],
                                ],
                            },
                        },
                        0,
                    ],
                },
                week: week.id.toString(),
            })
            .group({ _id: "$_id", activeSubscriptions: { $sum: {} } })
            .count("activeCustomers");

        return count[0]?.activeCustomers ?? 0;
    }

    public async countNewLeadsByWeek(week: Week): Promise<number> {
        const count = await MongooseCustomer.aggregate()
            .project({
                _id: 1,
            })
            .lookup({ from: "Subscription", localField: "_id", foreignField: "customer", as: "subscriptions" })
            .lookup({ from: "Order", localField: "_id", foreignField: "customer", as: "orders" })
            .match({
                $expr: {
                    $and: [
                        {
                            $gt: [
                                {
                                    $size: {
                                        $ifNull: [
                                            {
                                                $filter: {
                                                    input: "$subs",
                                                    as: "sub",
                                                    cond: { $ne: [{ $getField: { field: "state", input: "sub" } }, "SUBSCRIPTION_ACTIVE"] },
                                                },
                                            },
                                            [],
                                        ],
                                    },
                                },
                                0,
                            ],
                        },
                        { $gt: [{ $size: { $ifNull: ["$orders", []] } }, 0] },
                    ],
                },
                week: week.id.toString(),
            })
            .group({ _id: "$_id", newLeadsQty: { $sum: 1 } })
            .count("newLeadsQty");

        return count[0]?.newLeadsQty ?? 0;
    }

    public async countNewCustomersByWeek(week: Week): Promise<number> {
        return await MongooseCustomer.count({ receivedOrdersQuantity: 0, createdAt: { $gte: week.minDay, $lte: week.maxDay } });
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

    public async findAllWithWalletEnabled(): Promise<Customer[]> {
        return await this.findBy({ "wallet.isEnabled": true });
    }
}
