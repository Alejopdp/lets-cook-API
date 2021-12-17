import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { CancelAPaymentOrderDto } from "./cancelAPaymentOrderDto";

export class CancelAPaymentOrder {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, orderRepository: IOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }
    public async execute(dto: CancelAPaymentOrderDto): Promise<any> {
        const paymentOrder = await this.paymentOrderRepository.findByIdOrThrow(new PaymentOrderId(dto.paymentOrderId));

        paymentOrder.toCancelled([]);

        await this.paymentOrderRepository.save(paymentOrder);
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
