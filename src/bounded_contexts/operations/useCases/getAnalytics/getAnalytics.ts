import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetAnalyticsDto } from "./getAnalyticsDto";

export class GetAnalytics {
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _customerRepository: ICustomerRepository;

    constructor(
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        subscriptionRepository: ISubscriptionRepository,
        customerRepository: ICustomerRepository
    ) {
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._customerRepository = customerRepository;
    }
    public async execute(dto: GetAnalyticsDto): Promise<any> {
        const [currentWeek, nextWeek] = await Promise.all([this.weekRepository.findActualWeek(), this.weekRepository.findNextWeek()]);
        const [
            currentWeekOrdersQty,
            nextWeekOrdersQty,
            currentWeekKitsForCooking,
            nextWeekKitsForCooking,
            currentWeekAdditionalOrdersQty,
            nextWeekAdditionalOrdersQty,
            currentWeekNewCustomersQty,
            nextWeekNewCustomersQty,
            currentWeekActiveCustomers,
            nextWeekActiveCustomers,
            currentWeekNewLeads,
            nextWeekNewLeads,
            currentWeekCancelledSubscriptionsQty,
            nextWeeekCancelledSubscriptionsQty,
            currentWeekhalfWeekReceived,
            nextWeekHalfWeekReceived,
        ] = await Promise.all([
            this.orderRepository.countPlanActiveOrdersByWeek(currentWeek!, PlanType.Principal),
            this.orderRepository.countPlanActiveOrdersByWeek(nextWeek!, PlanType.Principal),
            this.orderRepository.countKitsForCookingByWeek(currentWeek!),
            this.orderRepository.countKitsForCookingByWeek(nextWeek!),
            this.orderRepository.countPlanActiveOrdersByWeek(currentWeek!, PlanType.Adicional),
            this.orderRepository.countPlanActiveOrdersByWeek(nextWeek!, PlanType.Adicional),
            this.customerRepository.countNewCustomersByWeek(currentWeek!),
            this.customerRepository.countNewCustomersByWeek(nextWeek!),
            this.customerRepository.countActiveCustomersByWeek(currentWeek!), // TO DO: Use previous week
            this.customerRepository.countActiveCustomersByWeek(nextWeek!), // TO DO: Use previous week
            this.customerRepository.countNewLeadsByWeek(currentWeek!), // TO DO: Use previous week
            this.customerRepository.countNewLeadsByWeek(nextWeek!), // TO DO: Use previous week
            this.subscriptionRepository.countCancelledSubscriptionsByWeek(currentWeek!), // TO DO: IMplement by week
            this.subscriptionRepository.countCancelledSubscriptionsByWeek(nextWeek!), // TO DO: IMplement by week
            this.paymentOrderRepository.countHalfWeekOrdersByWeek(currentWeek!),
            this.paymentOrderRepository.countHalfWeekOrdersByWeek(nextWeek!),
        ]);
        const [
            currentWeekBilledAmount,
            nextWeekBilledAmount,
            currentWeekBilledAmountAvg,
            nextWeekBilledAmountAvg,
            currentWeekNumberOfPersons,
            nextWeekNumberOfPersons,
        ] = await Promise.all([
            this.orderRepository.getBilledAmountSumByWeek(currentWeek!),
            this.orderRepository.getBilledAmountSumByWeek(nextWeek!),
            this.orderRepository.getBilledAmountAvgByWeek(currentWeek!),
            this.orderRepository.getBilledAmountAvgByWeek(nextWeek!),
            this.orderRepository.getNumberOfPersonsByWeek(currentWeek!),
            this.orderRepository.getNumberOfPersonsByWeek(nextWeek!),
        ]);

        const roundedCurrentWeekBilledAmount = currentWeekBilledAmount / 100;
        const roundedNextWeekBilledAmount = nextWeekBilledAmount / 100;
        const roundedCurrentWeekBilledAmountAvg = currentWeekBilledAmountAvg / 100;
        const roundedNextWeekBilledAmountAvg = nextWeekBilledAmountAvg / 100;
        const currentWeekNumberOfPersonsAvg = currentWeekNumberOfPersons / currentWeekOrdersQty;
        const nextWeekNumberOfPersonsAvg = nextWeekNumberOfPersons / nextWeekOrdersQty;
        const currentWeekSkippedAvg = 1 - currentWeekOrdersQty / currentWeekActiveCustomers;
        const nextWeekSkippedAvg = 1 - nextWeekOrdersQty / nextWeekActiveCustomers;

        return {
            currentWeekOrdersQty,
            nextWeekOrdersQty,
            ordersQtyPercentage: Math.round((nextWeekOrdersQty / currentWeekOrdersQty - 1) * 100),
            currentWeekKitsForCooking,
            nextWeekKitsForCooking,
            kitsForCookingPercentage: Math.round((nextWeekKitsForCooking * 100) / currentWeekKitsForCooking),
            currentWeekBilledAmount: roundedCurrentWeekBilledAmount,
            nextWeekBilledAmount: roundedNextWeekBilledAmount,
            billedAmountPercentage: Math.round((roundedNextWeekBilledAmount / roundedCurrentWeekBilledAmount - 1) * 100),
            currentWeekBilledAmountAvg: roundedCurrentWeekBilledAmountAvg,
            nextWeekBilledAmountAvg: roundedNextWeekBilledAmountAvg,
            billedAmountAvgPercentage: Math.round((roundedNextWeekBilledAmountAvg / roundedCurrentWeekBilledAmountAvg - 1) * 100),
            currentWeekNumberOfPersons,
            nextWeekNumberOfPersons,
            numberOfPersonsPercentage: Math.round((nextWeekNumberOfPersons * 100) / currentWeekNumberOfPersons),
            currentWeekNumberOfPersonsAvg,
            nextWeekNumberOfPersonsAvg,
            numberOfPersonsAvgPercentage: Math.round((nextWeekNumberOfPersonsAvg * 100) / currentWeekNumberOfPersonsAvg),
            currentWeekAdditionalOrdersQty,
            nextWeekAdditionalOrdersQty,
            additionalOrdersQtyPercentage: Math.round((nextWeekAdditionalOrdersQty * 100) / currentWeekAdditionalOrdersQty),
            currentWeekNewCustomersQty,
            nextWeekNewCustomersQty,
            newCustomersQtyPercentage: Math.round((nextWeekNewCustomersQty * 100) / currentWeekNewCustomersQty),
            currentWeekActiveCustomers,
            nextWeekActiveCustomers,
            activeCustomersPercentage: Math.round((nextWeekActiveCustomers * 100) / currentWeekActiveCustomers),
            currentWeekNewLeads,
            nextWeekNewLeads,
            newLeadsPercentage: Math.round((nextWeekNewLeads * 100) / currentWeekNewLeads),
            currentWeekCancelledSubscriptionsQty,
            nextWeeekCancelledSubscriptionsQty,
            cancelledSubscriptionsQtyPercentage: Math.round(
                (nextWeeekCancelledSubscriptionsQty * 100) / currentWeekCancelledSubscriptionsQty
            ),
            currentWeekhalfWeekReceived,
            nextWeekHalfWeekReceived,
            halfWeekReceivedPercentage: Math.round((nextWeekHalfWeekReceived * 100) / currentWeekhalfWeekReceived),
            currentWeekSkippedAvg,
            nextWeekSkippedAvg,
            skippedPercentage: Math.round((nextWeekSkippedAvg * 100) / currentWeekSkippedAvg),
        };
        // HAVE FUN
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
