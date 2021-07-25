import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { GetPaymentOrderByIdDto } from "./getPaymentOrderByIdDto";

export class GetPaymentOrderById {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, orderRepository: IOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: GetPaymentOrderByIdDto): Promise<{ paymentOrder: PaymentOrder; orders: Order[] }> {
        const paymentOrderId: PaymentOrderId = new PaymentOrderId(dto.paymentOrderId);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(paymentOrderId);
        const orders: Order[] = await this.orderRepository.findByPaymentOrderId(paymentOrderId);

        return { paymentOrder, orders };
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
