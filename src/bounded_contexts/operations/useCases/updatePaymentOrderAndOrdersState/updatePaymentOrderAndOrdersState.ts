import { UpdatePaymentOrderAndOrdersStateDto } from "./updatePaymentOrderAndOrdersStateDto";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";

export class UpdatePaymentOrderAndOrdersState {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, orderRepository: IOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: UpdatePaymentOrderAndOrdersStateDto): Promise<void> {
        const paymentOrderId: PaymentOrderId = new PaymentOrderId(dto.paymentOrderId);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(paymentOrderId);
        const orders: Order[] = await this.orderRepository.findByPaymentOrderId(paymentOrderId);

        paymentOrder.updateState(dto.paymentOrderState, orders);

        if (dto.paymentOrderState === "PAYMENT_ORDER_BILLED") {
            const paymentOrdersWithHumanIdCount = await this.paymentOrderRepository.countPaymentOrdersWithHumanId();
            paymentOrder.addHumanId(paymentOrdersWithHumanIdCount);
        }

        await this.paymentOrderRepository.save(paymentOrder);
        await this.orderRepository.saveOrdersWithNewState(orders);
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
