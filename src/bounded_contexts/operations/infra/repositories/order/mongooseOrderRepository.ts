import { Order } from "../../../domain/order/Order";
import { OrderId } from "../../../domain/order/OrderId";
import { IOrderRepository } from "./IOrderRepository";
import { Order as MongooseOrder } from "../../../../../infraestructure/mongoose/models";
import { orderMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";

export class MongooseOrderRepository implements IOrderRepository {
    public async save(order: Order): Promise<void> {
        const orderDb = orderMapper.toPersistence(order);
        if (await MongooseOrder.exists({ _id: order.id.value })) {
            await MongooseOrder.updateOne({ _id: order.id.value }, orderDb);
        } else {
            await MongooseOrder.create(orderDb);
        }
    }

    public async bulkSave(Orders: Order[]): Promise<void> {
        const ordersToSave = Orders.map((Order) => orderMapper.toPersistence(Order));

        await MongooseOrder.create(ordersToSave);
    }

    public async findById(OrderId: OrderId, locale: Locale): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findById(OrderId.value, { deletionFlag: false }).populate("plan").populate("week");

        return orderDb ? orderMapper.toDomain(orderDb, locale) : undefined;
    }

    public async findAll(locale: Locale): Promise<Order[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false })
            .populate("plan")
            .populate("week");

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    public async delete(orderId: OrderId): Promise<void> {
        await MongooseOrder.updateOne({ _id: orderId.value }, { deletionFlag: true });
    }
}
