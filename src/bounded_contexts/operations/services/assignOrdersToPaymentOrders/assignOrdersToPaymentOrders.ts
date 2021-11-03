import { logger } from "../../../../../config";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { CreatePaymentOrders } from "../createPaymentOrders/createPaymentOrders";
import { CreatePaymentOrdersDto } from "../createPaymentOrders/createPaymentOrdersDto";
import { AssignOrdersToPaymentOrdersDto } from "./assignOrdersToPaymentOrdersDto";

export class AssignOrdersToPaymentOrders {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _createPaymentOrdersService: CreatePaymentOrders;

    constructor(paymentOrderRepository: IPaymentOrderRepository, createPaymentOrdersService: CreatePaymentOrders) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._createPaymentOrdersService = createPaymentOrdersService;
    }

    public async execute(
        dto: AssignOrdersToPaymentOrdersDto
    ): Promise<{ newPaymentOrders: PaymentOrder[]; paymentOrdersToUpdate: PaymentOrder[] }> {
        var paymentOrdersToUpdate: PaymentOrder[] = await this.paymentOrderRepository.findActiveByCustomerAndBillingDateList(
            dto.orders.map((order) => order.billingDate),
            dto.subscription.customer.id
        );
        var newPaymentOrders: PaymentOrder[] = [];

        if (paymentOrdersToUpdate.length === 0) {
            const createPaymentOrdersServiceDto: CreatePaymentOrdersDto = {
                orders: dto.orders,
                // shippingCost: dto.hasFreeShipping ? 0 : dto.shippingCost,
                shippingCost: dto.shippingCost,
                subscription: dto.subscription,
            };

            newPaymentOrders = this.createPaymentOrdersService.execute(createPaymentOrdersServiceDto);
        } else {
            const ordersWithoutPaymentOrders = [];

            for (let order of dto.orders) {
                for (let paymentOrder of paymentOrdersToUpdate) {
                    if (order.billingDate.getTime() === paymentOrder.billingDate.getTime()) {
                        paymentOrder.addOrder(order);

                        break;
                    }
                }

                if (!!!order.paymentOrderId) ordersWithoutPaymentOrders.push(order);
            }

            if (ordersWithoutPaymentOrders.length > 0) {
                const createPaymentOrdersServiceDto: CreatePaymentOrdersDto = {
                    orders: ordersWithoutPaymentOrders,
                    // shippingCost: dto.hasFreeShipping ? 0 : dto.shippingCost,
                    shippingCost: dto.shippingCost,
                    subscription: dto.subscription,
                };
                newPaymentOrders = this.createPaymentOrdersService.execute(createPaymentOrdersServiceDto);
            }
        }

        return { newPaymentOrders, paymentOrdersToUpdate };
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter createPaymentOrdersService
     * @return {CreatePaymentOrders}
     */
    public get createPaymentOrdersService(): CreatePaymentOrders {
        return this._createPaymentOrdersService;
    }
}
