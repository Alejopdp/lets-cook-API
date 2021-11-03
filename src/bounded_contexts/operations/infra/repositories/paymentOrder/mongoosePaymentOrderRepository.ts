import { PaymentOrder } from "../../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";
import { IPaymentOrderRepository } from "./IPaymentOrderRepository";
import { PaymentOrder as MongoosePaymentOrder } from "../../../../../infraestructure/mongoose/models";
import { paymentOrderMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Subscription } from "../../../domain/subscription/Subscription";

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
        const paymentOrder = await MongoosePaymentOrder.findById(paymentOrderId.value, { deletionFlag: false })
            .populate("week")
            .populate({
                path: "recipes",
                populate: { path: "recipeVariants", populate: { path: "restriction" } },
            })
            .populate("plan");

        return paymentOrder ? paymentOrderMapper.toDomain(paymentOrder, locale) : undefined;
    }

    public async findFutureOrdersByCustomer(customerId: CustomerId): Promise<PaymentOrder[]> {
        return await this.findBy({ billingDate: { $gte: new Date() }, customer: customerId.value });
    }

    public async findByIdOrThrow(paymentOrderId: PaymentOrderId): Promise<PaymentOrder> {
        const paymentOrder: PaymentOrder | undefined = await this.findById(paymentOrderId, Locale.es);

        if (!!!paymentOrder) throw new Error("La orden de pago ingresada no existe");

        return paymentOrder;
    }

    public async findByIdList(paymentOrdersIds: PaymentOrderId[]): Promise<PaymentOrder[]> {
        return await this.findBy({ _id: paymentOrdersIds.map((id) => id.value) });
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

    public async findByBillingDateList(billingDateList: Date[], customerId: CustomerId): Promise<PaymentOrder[]> {
        return await this.findBy({ billingDate: billingDateList, customer: customerId.value }, Locale.es);
    }

    public async findAnActivePaymentOrder(): Promise<PaymentOrder | undefined> {
        const paymentOrderDb = await MongoosePaymentOrder.findOne({ state: "PAYMENT_ORDER_ACTIVE" })
            .populate("week")
            .populate({
                path: "recipes",
                populate: { path: "recipeVariants", populate: { path: "restriction" } },
            })
            .populate("plan");

        return paymentOrderDb ? paymentOrderMapper.toDomain(paymentOrderDb) : undefined;
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
        return await this.findBy({ customer: customerId.value });
    }

    public async findAll(locale: Locale): Promise<PaymentOrder[]> {
        return await this.findBy({}, locale);
    }

    public async findAllSortedByBillingDateDesc(locale: Locale): Promise<PaymentOrder[]> {
        const paymentOrdersDb = await MongoosePaymentOrder.find({ deletionFlag: false })
            .sort({ billingDate: -1 })
            .populate("week")
            .populate({
                path: "recipes",
                populate: { path: "recipeVariants", populate: { path: "restriction" } },
            })
            .populate("plan");

        return paymentOrdersDb.map((raw: any) => paymentOrderMapper.toDomain(raw, locale));
    }

    public async findBy(conditions: any, locale: Locale = Locale.es): Promise<PaymentOrder[]> {
        const paymentOrdersDb = await MongoosePaymentOrder.find({ ...conditions, deletionFlag: false })
            .sort({ billingDate: 1 })
            .populate("week")
            .populate({
                path: "recipes",
                populate: { path: "recipeVariants", populate: { path: "restriction" } },
            })
            .populate("plan");

        return paymentOrdersDb.map((raw: any) => paymentOrderMapper.toDomain(raw, locale));
    }

    public async findActiveByBillingDate(billingDate: Date): Promise<PaymentOrder[]> {
        return await this.findBy({ billingDate, state: "PAYMENT_ORDER_ACTIVE" }, Locale.es);
    }

    public async findByBillingDate(billingDate: Date): Promise<PaymentOrder[]> {
        return await this.findBy({ billingDate }, Locale.es);
    }

    public async findActiveByCustomerIdsList(customerIds: CustomerId[]): Promise<PaymentOrder[]> {
        return await this.findBy({
            customer: customerIds.map((id) => id.value),
            state: ["PAYMENT_ORDER_ACTIVE", "PAYMENT_ORDER_REJECTED", "PAYMENT_ORDER_PENDING_CONFIRMATION"],
        });
    }

    public async updateShippingCost(paymentOrders: PaymentOrder[], shippingCost: number): Promise<void> {
        // const paymentOrdersDb = paymentOrders.map(paymentOrder => paymentOrderMapper.toPersistence(paymentOrder))

        await MongoosePaymentOrder.updateMany({ _id: paymentOrders.map((po) => po.id.value) }, { shippingCost });
    }

    public async delete(paymentOrderId: PaymentOrderId): Promise<void> {
        await MongoosePaymentOrder.updateOne({ _id: paymentOrderId.value }, { deletionFlag: true });
    }
}
