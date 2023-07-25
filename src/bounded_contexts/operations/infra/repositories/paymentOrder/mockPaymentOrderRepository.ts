import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { PaymentOrder } from "@src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "@src/bounded_contexts/operations/domain/paymentOrder/PaymentOrderId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";
import { WeekId } from "@src/bounded_contexts/operations/domain/week/WeekId";
import { IPaymentOrderRepository } from "./IPaymentOrderRepository";

export class InMemoryPaymentOrderRepository implements IPaymentOrderRepository {

    private paymentOrders: PaymentOrder[] = [];

    public constructor(paymentOrders: PaymentOrder[]) {
        this.paymentOrders = paymentOrders;
    }
    public async save(paymentOrder: PaymentOrder): Promise<void> {
        const paymentOrderIndex = this.paymentOrders.findIndex((p) => p.id.equals(paymentOrder.id));
        if (paymentOrderIndex !== -1) {
            this.paymentOrders[paymentOrderIndex] = paymentOrder;
            return;
        }
        else {
            this.paymentOrders.push(paymentOrder);
            return;
        }

    }
    public async bulkSave(paymentOrders: PaymentOrder[]): Promise<void> {
        this.paymentOrders = this.paymentOrders.concat(paymentOrders);

    }
    public async updateMany(paymentOrders: PaymentOrder[]): Promise<void> {
        paymentOrders.forEach((paymentOrder) => {
            const paymentOrderIndex = this.paymentOrders.findIndex((p) => p.id.equals(paymentOrder.id));
            if (paymentOrderIndex !== -1) {
                this.paymentOrders[paymentOrderIndex] = paymentOrder;
            }
        });
    }
    countHalfWeekOrdersByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public async findAll(locale: Locale): Promise<PaymentOrder[]> {
        return this.paymentOrders;
    }
    findAllSortedByBillingDateAsc(locale: Locale): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    public async findById(paymentOrderId: PaymentOrderId, locale: Locale): Promise<PaymentOrder | undefined> {
        return this.paymentOrders.find((paymentOrder) => paymentOrder.id.equals(paymentOrderId));
    }
    findByIdOrThrow(paymentOrderId: PaymentOrderId): Promise<PaymentOrder> {
        throw new Error("Method not implemented.");
    }
    findBy(conditions: any, locale: Locale): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    public async findByCustomerId(customerId: CustomerId): Promise<PaymentOrder[]> {
        return this.paymentOrders.filter((paymentOrder) => paymentOrder.customerId.equals(customerId));

    }
    findNextTwelveByCustomer(customerId: CustomerId): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findFutureOrdersByCustomer(customerId: CustomerId): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findActiveByCustomerAndBillingDate(billingDate: Date, customerId: CustomerId): Promise<PaymentOrder | undefined> {
        throw new Error("Method not implemented.");
    }
    public async findActiveByCustomerAndBillingDateList(billingDates: Date[], customerId: CustomerId): Promise<PaymentOrder[]> {
        return this.paymentOrders.filter((paymentOrder) => paymentOrder.customerId.equals(customerId) && billingDates.some(bd => bd.getTime() === paymentOrder.billingDate.getTime()) && paymentOrder.state.isActive());
    }
    findActiveByBillingDate(billingDate: Date): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findByBillingDateList(billingDateList: Date[], customerId: CustomerId): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findByBillingDate(billingDate: Date): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findByIdList(paymentOrdersIds: PaymentOrderId[]): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findAnActivePaymentOrder(): Promise<PaymentOrder | undefined> {
        throw new Error("Method not implemented.");
    }
    findActiveByCustomerIdsList(customerIds: CustomerId[]): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    findByWeeks(weekIds: WeekId[]): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    public async countPaymentOrdersWithHumanId(): Promise<number> {
        return this.paymentOrders.filter((paymentOrder) => paymentOrder.humanId !== undefined).length;
    }
    updateShippingCost(paymentOrders: PaymentOrder[], shippingCost: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    existsBy(customerId: CustomerId): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(paymentOrderId: PaymentOrderId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findByCustomerIdsList(customerIds: CustomerId[]): Promise<PaymentOrder[]> {
        throw new Error("Method not implemented.");
    }
    destroyByCustomerId(customerId: CustomerId): Promise<void> {
        throw new Error("Method not implemented.");
    }

}