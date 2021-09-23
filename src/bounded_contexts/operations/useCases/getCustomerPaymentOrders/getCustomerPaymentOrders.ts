import { logger } from "../../../../../config";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { GetCustomerPaymentOrdersDto } from "./getCustomerPaymentOrdersDto";

export class GetCustomerPaymentOrders {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, orderRepository: IOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(
        dto: GetCustomerPaymentOrdersDto
    ): Promise<{ paymentOrders: PaymentOrder[]; ordersCountMap: { [key: string]: number } }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByCustomerId(customerId);
        const ordersCountMap: { [key: string]: number } = await this.orderRepository.getCountByPaymentOrderIdMap(
            paymentOrders.map((paymentOrder) => paymentOrder.id)
        );

        return { paymentOrders, ordersCountMap };
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
