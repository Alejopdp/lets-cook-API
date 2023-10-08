import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetPaymentOrderByIdDto } from "./getPaymentOrderByIdDto";
import { GetPaymentOrderByIdHttpResponse, GetPaymentOrderByIdPresenter } from "./getPaymentOrderByIdPresenter";

export class GetPaymentOrderById {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _presenter: GetPaymentOrderByIdPresenter
        ;

    constructor(
        paymentOrderRepository: IPaymentOrderRepository,
        orderRepository: IOrderRepository,
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository,
        presenter: GetPaymentOrderByIdPresenter
    ) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._presenter = presenter;
    }

    public async execute(
        dto: GetPaymentOrderByIdDto
    ): Promise<GetPaymentOrderByIdHttpResponse> {
        const paymentOrderId: PaymentOrderId = new PaymentOrderId(dto.paymentOrderId);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(paymentOrderId);
        const orders: Order[] = await this.orderRepository.findByPaymentOrderId(paymentOrderId, dto.locale);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(paymentOrder.customerId);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(
            orders.filter((order) => order.discountAmount > 0).map((order) => order.subscriptionId)
        );

        return this.presenter.present(paymentOrder, orders, customer, subscriptions, dto.locale);
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

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
    /**
 * Getter presenter
 * @return {GetPaymentOrderByIdPresenter}
 */
    public get presenter(): GetPaymentOrderByIdPresenter {
        return this._presenter;
    }


}
