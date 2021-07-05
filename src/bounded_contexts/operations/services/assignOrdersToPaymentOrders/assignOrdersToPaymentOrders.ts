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

    public async execute(dto: AssignOrdersToPaymentOrdersDto): Promise<void> {
        var paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findActiveByCustomerAndBillingDateList(
            dto.orders.map((order) => order.billingDate),
            dto.subscription.customer.id
        );

        logger.warn(`Las payment orders: ${JSON.stringify(paymentOrders)}`);
        if (paymentOrders.length === 0) {
            const createPaymentOrdersServiceDto: CreatePaymentOrdersDto = {
                orders: [...dto.orders],
                shippingCost: dto.shippingCost,
                subscription: dto.subscription,
            };

            paymentOrders = this.createPaymentOrdersService.execute(createPaymentOrdersServiceDto);

            for (let order of dto.orders) {
                order.assignPaymentOrder(paymentOrders);
            }

            await this.paymentOrderRepository.bulkSave(paymentOrders);
        } else {
            const ordersWithoutPaymentOrders = [];

            for (let order of dto.orders) {
                for (let paymentOrder of paymentOrders) {
                    if (order.billingDate.getTime() === paymentOrder.billingDate.getTime()) {
                        logger.info(`Order Billing Date: ${order.billingDate}`);
                        logger.info(`Payment Order Billing Date: ${paymentOrder.billingDate}`);
                        paymentOrder.addOrder(order);
                        break;
                    }
                }

                if (!!!order.paymentOrderId) ordersWithoutPaymentOrders.push(order);
            }

            if (ordersWithoutPaymentOrders.length > 0) {
                const createPaymentOrdersServiceDto: CreatePaymentOrdersDto = {
                    orders: ordersWithoutPaymentOrders,
                    shippingCost: dto.shippingCost,
                    subscription: dto.subscription,
                };
                const newPaymentOrders = this.createPaymentOrdersService.execute(createPaymentOrdersServiceDto);

                await this.paymentOrderRepository.bulkSave(newPaymentOrders);
            }
            await this.paymentOrderRepository.updateMany(paymentOrders);
        }

        // logger.warn(`A ver las payment orders: ${JSON.stringify(paymentOrders)}`);
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

// if (paymentOrders.length === 0) {
//     const shippingDate: Date = new Date(); // TO DO: Es necesaria la shipping date en la payment order?
//     const billingDate: Date = MomentTimeService.getDayOfThisWeekByDayNumber(6); // TO DO: Ubicarlas en sabado y crear por frecuencia

//     for (let i = 0; i <= 11; i++) {
//         billingDate.setDate(billingDate.getDate() + this.getFrequencyOffset(dto.subscription.frequency)); // TO DO: Create by frequency
//         const order: Order = dto.orders[i];
//         paymentOrders.push(
//             new PaymentOrder(
//                 shippingDate,
//                 new PaymentOrderActive(),
//                 "",
//                 new Date(billingDate),
//                 dto.weeks[i],
//                 order.price,
//                 0,
//                 dto.shippingCost,
//                 dto.customerId
//             )
//         );
//     }
