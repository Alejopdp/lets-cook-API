import { PaymentOrder } from "../../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";
import { IPaymentOrderRepository } from "./IPaymentOrderRepository";
import { PaymentOrder as MongoosePaymentOrder } from "../../../../../infraestructure/mongoose/models";
import { paymentOrderMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { CustomerId } from "../../../domain/customer/CustomerId";

export class MongoosePaymentOrderRepository implements IPaymentOrderRepository {
    public async save(paymentOrder: PaymentOrder): Promise<void> {
        const paymentOrderDb = paymentOrderMapper.toPersistence(paymentOrder);
        if (await MongoosePaymentOrder.exists({ _id: paymentOrder.id.value })) {
            await MongoosePaymentOrder.updateOne({ _id: paymentOrder.id.value }, paymentOrderDb);
        } else {
            await MongoosePaymentOrder.create(paymentOrder);
        }
    }

    public async bulkSave(paymentOrders: PaymentOrder[]): Promise<void> {
        const paymentOrdersToSave = paymentOrders.map((paymentOrder) => paymentOrderMapper.toPersistence(paymentOrder));

        await MongoosePaymentOrder.insertMany(paymentOrdersToSave);
    }

    public async updateMany(paymentOrders: PaymentOrder[]): Promise<void> {
        for (let order of paymentOrders) {
            const orderDb = paymentOrderMapper.toPersistence(order);
            await MongoosePaymentOrder.findOneAndUpdate({ _id: order.id.value }, orderDb);
        }
    }

    public async findById(paymentOrderId: PaymentOrderId, locale: Locale): Promise<PaymentOrder | undefined> {
        const paymentOrder = await MongoosePaymentOrder.findById(paymentOrderId.value, { deletionFlag: false }).populate("week");

        return paymentOrder ? paymentOrderMapper.toDomain(paymentOrder, locale) : undefined;
    }

    public async findNextTwelveByCustomer(customerId: CustomerId): Promise<PaymentOrder[]> {
        const paymentOrdersDb = await MongoosePaymentOrder.find({
            customerId: customerId.value,
            deletionFlag: false,
            shippingDate: { $gte: new Date() },
        })
            .sort({ billingDate: 1 })
            .populate("week");

        return paymentOrdersDb.map((raw: any) => paymentOrderMapper.toDomain(raw, Locale.es));
    }

    public async existsBy(customerId: CustomerId): Promise<boolean> {
        return await MongoosePaymentOrder.exists({ customer: customerId.value, state: "PAYMENT_ORDER_ACTIVE" });
    }

    public async findActiveByCustomerAndBillingDateList(billingDates: Date[], customerId: CustomerId): Promise<PaymentOrder[]> {
        return await this.findBy(
            {
                billingDate: billingDates,
                state: "PAYMENT_ORDER_ACTIVE",
                customer: customerId.value,
            },
            Locale.es
        );
    }

    public async findByCustomerId(customerId: CustomerId): Promise<PaymentOrder[]> {
        return await this.findBy({ customer: customerId.value }, Locale.es);
    }

    public async findAll(locale: Locale): Promise<PaymentOrder[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale: Locale): Promise<PaymentOrder[]> {
        const paymentOrdersDb = await MongoosePaymentOrder.find({ ...conditions, deletionFlag: false }).populate("week");

        return paymentOrdersDb.map((raw: any) => paymentOrderMapper.toDomain(raw, locale));
    }

    public async delete(paymentOrderId: PaymentOrderId): Promise<void> {
        await MongoosePaymentOrder.updateOne({ _id: paymentOrderId.value }, { deletionFlag: true });
    }
}
