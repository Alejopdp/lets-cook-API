import { UpdatePaymentOrderAndOrdersStateDto } from "./updatePaymentOrderAndOrdersStateDto";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";
import { Locale } from "../../domain/locale/Locale";

export class UpdatePaymentOrderAndOrdersState {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, orderRepository: IOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: UpdatePaymentOrderAndOrdersStateDto): Promise<{ billedPaymentOrderHumanId: string | number }> {
        const paymentOrderId: PaymentOrderId = new PaymentOrderId(dto.paymentOrderId);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(paymentOrderId);
        const orders: Order[] = await this.orderRepository.findByPaymentOrderId(paymentOrderId, Locale.es);

        paymentOrder.updateState(dto.paymentOrderState, orders, dto.queryDate);

        if (dto.paymentOrderState === "PAYMENT_ORDER_BILLED") {
            const paymentOrdersWithHumanIdCount = await this.paymentOrderRepository.countPaymentOrdersWithHumanId();
            paymentOrder.addHumanId(paymentOrdersWithHumanIdCount);
        }

        await this.paymentOrderRepository.save(paymentOrder);
        await this.orderRepository.saveOrdersWithNewState(orders);

        return { billedPaymentOrderHumanId: paymentOrder.getHumanIdOrIdValue() };
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
