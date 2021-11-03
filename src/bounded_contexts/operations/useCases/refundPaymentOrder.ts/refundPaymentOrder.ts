import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { RefundPaymentOrderDto } from "./refundPaymentOrderDto";
import { IPaymentService } from "../../application/paymentService/IPaymentService";

export class RefundPaymentOrder {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _paymentService: IPaymentService;

    constructor(paymentOrderRepository: IPaymentOrderRepository, paymentService: IPaymentService) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._paymentService = paymentService;
    }

    public async execute(dto: RefundPaymentOrderDto): Promise<PaymentOrder> {
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(new PaymentOrderId(dto.paymentOrderId));

        if (!!paymentOrder.paymentIntentId) await this.paymentService.refund(paymentOrder.paymentIntentId, dto.amount);

        paymentOrder.refund(dto.amount);

        await this.paymentOrderRepository.save(paymentOrder);

        return paymentOrder;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }
}
