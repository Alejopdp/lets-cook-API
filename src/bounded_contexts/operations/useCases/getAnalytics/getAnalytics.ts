import { Locale } from "../../domain/locale/Locale";
import { Plan } from "../../domain/plan/Plan";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { Week } from "../../domain/week/Week";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetAnalyticsDto } from "./getAnalyticsDto";

export class GetAnalytics {
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _customerRepository: ICustomerRepository;
    private _planRepository: IPlanRepository;

    constructor(
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        subscriptionRepository: ISubscriptionRepository,
        customerRepository: ICustomerRepository,
        planRepository: IPlanRepository
    ) {
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._customerRepository = customerRepository;
        this._planRepository = planRepository;
    }
    public async execute(dto: GetAnalyticsDto): Promise<any> {
        const [previousWeek, currentWeek, nextWeek, plans]: [Week | undefined, Week | undefined, Week | undefined, Plan[]] =
            await Promise.all([
                this.weekRepository.findPreviousWeek(),
                this.weekRepository.findActualWeek(),
                this.weekRepository.findNextWeek(),
                this.planRepository.findBy({ type: "Principal" }, Locale.es),
            ]);
        const plansNamesForGrouping = plans.map((plan) => plan.name);
        const [
            currentWeekBilledAmount,
            nextWeekBilledAmount,
            currentWeekBilledAmountAvg,
            nextWeekBilledAmountAvg,
            currentWeekNumberOfPersons,
            nextWeekNumberOfPersons,
        ]: [number, number, number, number, number, number] = await Promise.all([
            this.orderRepository.getBilledAmountSumByWeek(currentWeek!),
            this.orderRepository.getBilledAmountSumByWeek(nextWeek!),
            this.orderRepository.getBilledAmountAvgByWeek(currentWeek!),
            this.orderRepository.getBilledAmountAvgByWeek(nextWeek!),
            this.orderRepository.getNumberOfPersonsByWeek(currentWeek!),
            this.orderRepository.getNumberOfPersonsByWeek(nextWeek!),
        ]);

        //@ts-ignore
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
            currentWeekCustomersWhoChoseRecipes,
            currentWeekCustomersWhoChoseRecipesByNumberOfPersons,
        ]: [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            {
                _id: string;
                chosenRecipes: number;
                notChosenRecipes: number;
            }[],
            {
                _id: string;
                chosenRecipes: number;
                notChosenRecipes: number;
            }[]
            //@ts-ignore
        ] = await Promise.all([
            this.orderRepository.countPlanActiveOrdersByWeek(currentWeek!, PlanType.Principal),
            this.orderRepository.countPlanActiveOrdersByWeek(nextWeek!, PlanType.Principal),
            this.orderRepository.countKitsForCookingByWeek(currentWeek!),
            this.orderRepository.countKitsForCookingByWeek(nextWeek!),
            this.orderRepository.countPlanActiveOrdersByWeek(currentWeek!, PlanType.Adicional),
            this.orderRepository.countPlanActiveOrdersByWeek(nextWeek!, PlanType.Adicional),
            this.customerRepository.countNewCustomersByWeek(currentWeek!),
            this.customerRepository.countNewCustomersByWeek(nextWeek!),
            this.orderRepository.countActiveCustomersByWeek(currentWeek!),
            this.orderRepository.countActiveCustomersByWeek(nextWeek!),
            this.customerRepository.countNewLeadsByWeek(currentWeek!),
            this.customerRepository.countNewLeadsByWeek(nextWeek!),
            this.subscriptionRepository.countCancelledSubscriptionsByWeek(currentWeek!),
            this.subscriptionRepository.countCancelledSubscriptionsByWeek(nextWeek!),
            this.paymentOrderRepository.countHalfWeekOrdersByWeek(currentWeek!),
            this.paymentOrderRepository.countHalfWeekOrdersByWeek(nextWeek!),
            this.orderRepository.countCustomersWhoChoseRecipesByWeekGroupedByPlan(nextWeek!),
            this.orderRepository.countCustomersWhoChoseRecipesByWeekGroupedByNumberOfPersons(nextWeek!),
        ]);

        const roundedCurrentWeekBilledAmount = currentWeekBilledAmount / 100;
        const roundedNextWeekBilledAmount = nextWeekBilledAmount / 100;
        const roundedCurrentWeekBilledAmountAvg = currentWeekBilledAmountAvg / 100;
        const roundedNextWeekBilledAmountAvg = nextWeekBilledAmountAvg / 100;
        const currentWeekNumberOfPersonsAvg = Math.ceil(currentWeekNumberOfPersons / currentWeekOrdersQty);
        const nextWeekNumberOfPersonsAvg = Math.ceil(nextWeekNumberOfPersons / nextWeekOrdersQty);
        const currentWeekSkippedAvg = 1 - currentWeekOrdersQty / currentWeekActiveCustomers;
        const nextWeekSkippedAvg = 1 - nextWeekOrdersQty / nextWeekActiveCustomers;
        const chosenRecipesGroupedByPlan: {
            [planName: string]: {
                chosenRecipes: number;
                notChosenRecipes: number;
                percentage: number;
            };
        } = {};
        const chosenRecipesGroupedByNumberOfPersons: {
            [numberOfPersons: string]: {
                chosenRecipes: number;
                notChosenRecipes: number;
                percentage: number;
            };
        } = {};

        for (const group of currentWeekCustomersWhoChoseRecipesByNumberOfPersons) {
            chosenRecipesGroupedByNumberOfPersons[group._id.toString()] = {
                chosenRecipes: group.chosenRecipes,
                notChosenRecipes: group.notChosenRecipes,
                percentage: Math.round((group.chosenRecipes / (group.chosenRecipes + group.notChosenRecipes)) * 100),
            };
        }

        for (const planName of plansNamesForGrouping) {
            const currentWeekChosenRecipes =
                currentWeekCustomersWhoChoseRecipes.find((group: any) => group._id === planName)?.chosenRecipes || 0;
            const currentWeekNotChosenRecipes =
                currentWeekCustomersWhoChoseRecipes.find((group: any) => group._id === planName)?.notChosenRecipes || 0;

            chosenRecipesGroupedByPlan[planName] = {
                chosenRecipes: currentWeekChosenRecipes,
                notChosenRecipes: currentWeekNotChosenRecipes,
                percentage: Math.round((currentWeekChosenRecipes / currentWeekNotChosenRecipes) * 100),
            };
        }

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
            numberOfPersonsPercentage: Math.round((nextWeekNumberOfPersons / currentWeekNumberOfPersons) * 100),
            currentWeekNumberOfPersonsAvg,
            nextWeekNumberOfPersonsAvg,
            numberOfPersonsAvgPercentage: Math.round((nextWeekNumberOfPersonsAvg * 100) / currentWeekNumberOfPersonsAvg),
            currentWeekAdditionalOrdersQty,
            nextWeekAdditionalOrdersQty,
            additionalOrdersQtyPercentage: Math.round((nextWeekAdditionalOrdersQty / currentWeekAdditionalOrdersQty) * 100),
            currentWeekNewCustomersQty,
            nextWeekNewCustomersQty,
            newCustomersQtyPercentage: Math.round((nextWeekNewCustomersQty / currentWeekNewCustomersQty) * 100),
            currentWeekActiveCustomers,
            nextWeekActiveCustomers,
            activeCustomersPercentage: Math.round((nextWeekActiveCustomers * 100) / currentWeekActiveCustomers),
            currentWeekNewLeads,
            nextWeekNewLeads,
            newLeadsPercentage: Math.round((nextWeekNewLeads / currentWeekNewLeads) * 100) || 0,
            currentWeekCancelledSubscriptionsQty,
            nextWeeekCancelledSubscriptionsQty,
            cancelledSubscriptionsQtyPercentage:
                Math.round((nextWeeekCancelledSubscriptionsQty / currentWeekCancelledSubscriptionsQty) * 100) || 0,
            currentWeekhalfWeekReceived,
            nextWeekHalfWeekReceived,
            halfWeekReceivedPercentage: Math.round((nextWeekHalfWeekReceived / currentWeekhalfWeekReceived) * 100) || 0,
            currentWeekSkippedAvg,
            nextWeekSkippedAvg,
            skippedPercentage: Math.round((nextWeekSkippedAvg * 100) / currentWeekSkippedAvg),
            chosenRecipesGroupedByPlan,
            chosenRecipesGroupedByNumberOfPersons,
        };
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

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
