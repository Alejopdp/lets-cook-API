import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { RefundPaymentOrderDto } from "./refundPaymentOrderDto";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";

export class RefundPaymentOrder {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _paymentService: IPaymentService;
    private _logRepository: ILogRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, paymentService: IPaymentService, logRepository: ILogRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._paymentService = paymentService;
        this._logRepository = logRepository;
    }

    public async execute(dto: RefundPaymentOrderDto): Promise<PaymentOrder> {
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(new PaymentOrderId(dto.paymentOrderId));

        if (!!paymentOrder.paymentIntentId) await this.paymentService.refund(paymentOrder.paymentIntentId, dto.amount);

        paymentOrder.refund(dto.amount);

        await this.paymentOrderRepository.save(paymentOrder);
        this.logRepository.save(
            new Log(
                LogType.REFUND,
                "Admin",
                "Admin",
                paymentOrder.isPartiallyRefunded()
                    ? `Se reembolsaron ${dto.amount} € del pago ${paymentOrder.humanId}`
                    : `Se reembolsó la totalidad del pago ${paymentOrder.humanId} (${paymentOrder.amount} €)`,
                paymentOrder.isPartiallyRefunded()
                    ? `Se reembolsaron ${dto.amount} € (Payment order: ${paymentOrder.id.toString()})`
                    : `Se reembolsó la totalidad del pago (${paymentOrder.amount}) (Payment order: ${paymentOrder.id.toString()})`,
                new Date(),
                paymentOrder.customerId
            )
        );

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

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}
