import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { AssignOrdersToPaymentOrdersDto } from "./assignOrdersToPaymentOrdersDto";

export class AssignOrdersToPaymentOrders {
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(dto: AssignOrdersToPaymentOrdersDto): Promise<void> {
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findNextTwelveByCustomer(dto.customerId);

        if (paymentOrders.length === 0) {
            const shippingDate: Date = new Date(); // TO DO: Es necesaria la shipping date en la payment order?
            const billingDate: Date = MomentTimeService.getDayOfThisWeekByDayNumber(6); // TO DO: Ubicarlas en sabado y crear por frecuencia

            for (let i = 0; i <= 11; i++) {
                billingDate.setDate(billingDate.getDate() + 7);
                paymentOrders.push(
                    new PaymentOrder(shippingDate, new PaymentOrderActive(), "", billingDate, dto.weeks[i], 0, 0, 0, dto.customerId)
                );
            }
        }

        for (let order of dto.orders) {
            order.assignPaymentOrder(paymentOrders);
        }
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
