import { Customer } from "../../domain/customer/Customer";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { RetryPaymentOfRejectedPaymentOrderDto } from "./retryPaymentOfRejectedPaymentOrderDto";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { Order } from "../../domain/order/Order";
import { Locale } from "../../domain/locale/Locale";
import Stripe from "stripe";
import { PaymentIntent } from "../../application/paymentService";

export class RetryPaymentOfRejectedPaymentOrder {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _customerRepository: ICustomerRepository;
    private _paymentService: IPaymentService;
    private _orderRepository: IOrderRepository;

    constructor(
        paymentOrderRepository: IPaymentOrderRepository,
        customerRepository: ICustomerRepository,
        paymentService: IPaymentService,
        orderRepository: IOrderRepository
    ) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._paymentService = paymentService;
        this._customerRepository = customerRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: RetryPaymentOfRejectedPaymentOrderDto): Promise<PaymentOrder> {
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(new PaymentOrderId(dto.paymentOrderId));
        if (!paymentOrder.isPaymentRejected()) throw new Error("El pago de la orden nunca fue rechazado");

        const customer: Customer = await this.customerRepository.findByIdOrThrow(paymentOrder.customerId);
        if (!customer.getDefaultPaymentMethod()) throw new Error("El cliente no tienen ningún método de pago asociado");

        const [orders, paymentOrderWithHumanIdCount]: [Order[], number] = await Promise.all([
            await this.orderRepository.findByPaymentOrderId(paymentOrder.id, Locale.es),
            await this.paymentOrderRepository.countPaymentOrdersWithHumanId(),
        ]);

        var paymentIntent: Stripe.PaymentIntent | PaymentIntent = {
            id: "",
            status: "succeeded",
            client_secret: "",
            amount: 0
        };
        const customerHasWalletAsDefaultPaymentMethod = customer.getDefaultPaymentMethod()?.id.toString() === "wallet";

        if (customerHasWalletAsDefaultPaymentMethod) {
            const succeeded = customer.payBillingJobWithWallet(paymentOrder.getFinalAmount());

            if (!succeeded) throw new Error("Ocurrió un error inesperado, intenta nuevamente");

            paymentIntent = {
                id: "Monedero",
                status: "succeeded",
                client_secret: "",
                amount: paymentOrder.getFinalAmount()
            };
        }

        if (!customerHasWalletAsDefaultPaymentMethod) {
            const stripePaymentIntent = await this.paymentService.paymentIntent(
                paymentOrder.getFinalAmount(),
                customer.getDefaultPaymentMethod()?.stripeId!,
                customer.email,
                customer.stripeId,
                true
            );

            paymentIntent = stripePaymentIntent;
        }

        this.throwErrorIfHasErrors(paymentIntent)

        paymentOrder.paymentIntentId = paymentIntent.id;
        paymentOrder.toBilled(orders, customer);
        paymentOrder.addHumanId(paymentOrderWithHumanIdCount);

        await this.paymentOrderRepository.save(paymentOrder);
        await this.customerRepository.save(customer);

        return paymentOrder;
    }

    private throwErrorIfHasErrors(paymentIntent: Stripe.PaymentIntent | PaymentIntent) {
        if (!!!paymentIntent) throw new Error("Ocurrió un error inesperado, intenta nuevamente");
        if (paymentIntent.status === "canceled") throw new Error("Error al procesar el pago, el mismo fue cancelado");
        if (paymentIntent.status === "requires_action")
            throw new Error("Error al procesar el pago, el cliente no autorizó el uso de la tarjeta");
        if (paymentIntent.status === "requires_confirmation")
            throw new Error("Error al procesar el pago, el cliente no autorizó el uso de la tarjeta");
        if (paymentIntent.status === "requires_payment_method")
            throw new Error("Error al procesar el pago, el cliente necesita agregar un método de pago");
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
