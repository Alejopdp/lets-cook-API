import _ from "lodash";
import { logger } from "../../../../../config";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { CreatePaymentOrdersForDifferentFreqOrders } from "../createPaymentOrdersForDifferentFreqOrders/createPaymentOrdersForDifferentFreqOrders";
import { CreatePaymentOrdersForDifferentFreqOrdersDto } from "../createPaymentOrdersForDifferentFreqOrders/createPaymentOrdersForDifferentFreqOrdersDto";
import { AssignOrdersWithDifferentFreqToPaymentOrdersDto } from "./assignOrdersWithDifferentFreqToPaymentOrdersDto";

export class AssignOrdersWithDifferentFreqToPaymentOrders {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _createPaymentOrdersService: CreatePaymentOrdersForDifferentFreqOrders;

    constructor(paymentOrderRepository: IPaymentOrderRepository, createPaymentOrdersService: CreatePaymentOrdersForDifferentFreqOrders) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._createPaymentOrdersService = createPaymentOrdersService;
    }

    public async execute(
        dto: AssignOrdersWithDifferentFreqToPaymentOrdersDto
    ): Promise<{ newPaymentOrders: PaymentOrder[]; paymentOrdersToUpdate: PaymentOrder[] }> {
        const orderBillingList: Date[] = dto.orders.map((order) => order.billingDate); // TO DO: Remove duplicates

        var paymentOrdersToUpdate: PaymentOrder[] = await this.paymentOrderRepository.findActiveByCustomerAndBillingDateList(
            orderBillingList,
            dto.customerId
        );
        var newPaymentOrders: PaymentOrder[] = [];

        if (paymentOrdersToUpdate.length === 0) {
            const createPaymentOrdersServiceDto: CreatePaymentOrdersForDifferentFreqOrdersDto = {
                orders: dto.orders,
                shippingCost: dto.shippingCost,
                customerId: dto.customerId,
            };

            newPaymentOrders = this.createPaymentOrdersService.execute(createPaymentOrdersServiceDto);

            for (let order of dto.orders) {
                order.assignPaymentOrder(newPaymentOrders);
            }
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
                const createPaymentOrdersServiceDto: CreatePaymentOrdersForDifferentFreqOrdersDto = {
                    orders: ordersWithoutPaymentOrders,
                    shippingCost: dto.shippingCost,
                    customerId: dto.customerId,
                };

                newPaymentOrders = this.createPaymentOrdersService.execute(createPaymentOrdersServiceDto);

                for (let order of ordersWithoutPaymentOrders) {
                    order.assignPaymentOrder(newPaymentOrders);
                }
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
     * @return {CreatePaymentOrdersForDifferentFreqOrders}
     */
    public get createPaymentOrdersService(): CreatePaymentOrdersForDifferentFreqOrders {
        return this._createPaymentOrdersService;
    }
}
