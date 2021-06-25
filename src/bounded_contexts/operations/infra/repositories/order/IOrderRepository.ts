import { Locale } from "../../../domain/locale/Locale";
import { Order } from "../../../domain/order/Order";
import { OrderId } from "../../../domain/order/OrderId";

export interface IOrderRepository {
    save(order: Order): Promise<void>;
    bulkSave(orders: Order[]): Promise<void>;
    findAll(locale: Locale): Promise<Order[]>;
    findById(orderId: OrderId, locale: Locale): Promise<Order | undefined>;
    findBy(conditions: any, locale: Locale): Promise<Order[]>;
    delete(orderId: OrderId): Promise<void>;
    // findOrderById(orderId: OrderId): Promise<Order | undefined>;
}
