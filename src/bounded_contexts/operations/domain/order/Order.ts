import { Utils } from "../../../..//core/logic/Utils";
import { logger } from "../../../../../config";
import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../customer/Customer";
import { PaymentOrder } from "../paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../paymentOrder/PaymentOrderId";
import { Plan } from "../plan/Plan";
import { PlanVariant } from "../plan/PlanVariant/PlanVariant";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";
import { RecipeVariantId } from "../recipe/RecipeVariant/RecipeVariantId";
import { SubscriptionId } from "../subscription/SubscriptionId";
import { Week } from "../week/Week";
import { OrderId } from "./OrderId";
import { IOrderState } from "./orderState/IOrderState";
import { RecipeSelection } from "./RecipeSelection";
import { RecipeVariantRestriction } from "../recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariant } from "../recipe/RecipeVariant/RecipeVariant";

export class Order extends Entity<Order> {
    private _shippingDate: Date;
    private _state: IOrderState;
    private _billingDate: Date;
    private _week: Week;
    private _planVariantId: PlanVariantId;
    private _plan: Plan;
    private _price: number;
    private _discountAmount: number;
    private _hasFreeShipping: boolean;
    private _subscriptionId: SubscriptionId;
    private _recipesVariantsIds: RecipeVariantId[];
    private _recipeSelection: RecipeSelection[];
    private _choseByAdmin: boolean;
    private _firstDateOfRecipesSelection?: Date;
    private _lastDateOfRecipesSelection?: Date;
    private _paymentOrderId?: PaymentOrderId;
    private _createdAt: Date;
    private _customer: Customer;
    private _counter: number;
    private _isFirstOrderOfSubscription: boolean;

    constructor(
        shippingDate: Date,
        state: IOrderState,
        billingDate: Date,
        week: Week,
        planVariantId: PlanVariantId,
        plan: Plan,
        price: number,
        discountAmount: number,
        hasFreeShipping: boolean,
        subscriptionId: SubscriptionId,
        recipeVariantsIds: RecipeVariantId[],
        recipeSelection: RecipeSelection[],
        choseByAdmin: boolean,
        customer: Customer,
        firstDateOfRecipesSelection?: Date,
        lastDateOfRecipesSelection?: Date,
        paymentOrderId?: PaymentOrderId,
        orderId?: OrderId,
        createdAt: Date = new Date(),
        counter: number = 0,
        isFirstOrderOfSubscription: boolean = false
    ) {
        super(orderId);
        this._shippingDate = shippingDate;
        this._state = state;
        this._billingDate = billingDate;
        this._week = week;
        this._planVariantId = planVariantId;
        this._plan = plan;
        this._price = Math.round(price * 100) / 100;
        this._discountAmount = Math.round(discountAmount * 100) / 100;
        this._hasFreeShipping = hasFreeShipping;
        this._subscriptionId = subscriptionId;
        this._recipesVariantsIds = recipeVariantsIds;
        this._recipeSelection = recipeSelection;
        this._choseByAdmin = choseByAdmin;
        this._firstDateOfRecipesSelection = firstDateOfRecipesSelection;
        this._lastDateOfRecipesSelection = lastDateOfRecipesSelection;
        this._paymentOrderId = paymentOrderId;
        this._createdAt = createdAt;
        this._customer = customer;
        this._counter = counter;
        this._isFirstOrderOfSubscription = isFirstOrderOfSubscription;
    }

    public updateRecipes(recipeSelection: RecipeSelection[], isAdminChoosing: boolean, restriction?: RecipeVariantRestriction): void {
        // TO DO: Search for a better guard?
        recipeSelection = recipeSelection.filter((selection) => selection.quantity > 0);
        const planVariant: PlanVariant = this.plan.getPlanVariantById(this.planVariantId)!;
        const totalIncomingRecipes = recipeSelection.reduce((acc, recipeSelection) => acc + recipeSelection.quantity, 0);

        if (totalIncomingRecipes > planVariant.getNumberOfRecipes())
            throw new Error(
                `No puedes elegir mas de ${planVariant.getNumberOfRecipes()} recetas para el plan ${
                    this.plan.name
                } y variante de ${planVariant.getLabel()}`
            );

        for (let selection of recipeSelection) {
            if (selection.recipe.relatedPlans.every((planId) => !planId.equals(this.plan.id)))
                throw new Error(
                    `La receta ${selection.recipe.getName()} (variante con SKU ${selection.recipe.getVariantSkuByVariantsIds([
                        selection.recipeVariantId,
                    ])}) no está asociada al ${this.plan.name}`
                );
            const recipeVariantRestriction: RecipeVariantRestriction | undefined = selection.recipe.getVariantRestriction(
                selection.recipeVariantId
            );
            if (!!restriction && !restriction.equals(recipeVariantRestriction) && !restriction.acceptsEveryRecipe())
                throw new Error(
                    `El cliente ${this.customer.getFullNameOrEmail()} no puede consumir una receta que no cumpla con ${
                        restriction.label
                    } en la suscripción ${this.subscriptionId.value}`
                );
            if (selection.recipe.availableWeeks.every((week) => !week.id.equals(this.week.id))) {
                // TO DO: Available weeks could grow too big
                throw new Error(`La receta ${selection.recipe.getName()} no está disponible en la semana ${this.week.getLabel()}`);
            }
        }

        this.recipeSelection = recipeSelection;
        this.choseByAdmin = isAdminChoosing;
        if (!!!this.firstDateOfRecipesSelection) this.firstDateOfRecipesSelection = new Date();
        this.lastDateOfRecipesSelection = new Date();
    }

    public isActive(): boolean {
        return this.state.isActive();
    }

    public isBilled(): boolean {
        return this.state.isBilled();
    }

    public isSkipped(): boolean {
        return this.state.isSkipped();
    }

    public isCancelled(): boolean {
        return this.state.isCancelled();
    }
    public isPaymentPending(): boolean {
        return this.state.isPendingPayment();
    }

    public isPaymentRejected(): boolean {
        return this.state.isPaymentRejected();
    }

    public skip(paymentOrder: PaymentOrder): void {
        if (this.isBilled()) throw new Error("No es posible saltar una orden que ya fue cobrada");
        const today = new Date();

        if (today > this.shippingDate) throw new Error("No es posible saltar una orden pasada");
        paymentOrder.discountOrderAmount(this);

        this.state.toSkipped(this);
    }

    public reactivate(paymentOrder: PaymentOrder): void {
        const today = new Date();

        if (today > this.shippingDate) throw new Error("No es posible reaundar una orden pasada");
        if (this.isSkipped()) {
            paymentOrder.addOrder(this);
            this.state.toActive(this);
        }
    }

    public toPaymentPending(): void {
        this.state.toPaymentPending(this);
    }

    public toPaymentRejected(): void {
        this.state.toPaymentRejected(this);
    }

    public getWeekLabel(): string {
        return this.week.getLabel();
    }

    public bill(customer?: Customer): void {
        if (this.isCancelled()) return;
        if (this.isSkipped()) return;
        if (this.isBilled()) return;

        this.state.toBilled(this);
        if (!!customer) {
            customer.countOneReceivedOrder();
        }
    }

    public cancel(paymentOrder?: PaymentOrder): void {
        // if (paymentOrder && (this.isActive() || this.isPaymentPending())) {
        if (paymentOrder && this.isActive()) {
            paymentOrder.discountOrderAmount(this); // Cancels payment ordeer if amount === 0
            // if (this.hasFreeShipping) paymentOrder.shippingCost = customerShippingCost
        }

        // if (
        //     paymentOrder &&
        //     paymentOrder.amount === 0 &&
        //     (paymentOrder.state.title === "PAYMENT_ORDER_ACTIVE" || paymentOrder.state.title === "PAYMENT_ORDER_PENDING_CONFIRMATION")
        // )
        //     paymentOrder.toCancelled([]);

        if (this.state.title === "ORDER_BILLED") return;
        this.state.toCancelled(this);
    }

    public getTotalPrice(): number {
        return this.price;
    }

    public swapPlan(newPlan: Plan, newPlanVariantId: PlanVariantId): void {
        if (this.isBilled()) return;
        this.plan = newPlan;
        this.planVariantId = newPlanVariantId;
        this.recipeSelection = [];
        this.recipesVariantsIds = [];
        this.price = newPlan.getPlanVariantPrice(newPlanVariantId);
    }

    public getDdMmYyyyShipmentDate(): string {
        return MomentTimeService.getDdMmYyyy(this.shippingDate);
    }
    public getHumanShippmentDay(): string {
        return MomentTimeService.getDateHumanLabel(this.shippingDate);
    }

    public getDdMmYyyyBillingDate(): string {
        return MomentTimeService.getDdMmYyyy(this.billingDate);
    }

    public getHumanBillingDay(): string {
        return MomentTimeService.getDateHumanLabel(this.billingDate);
    }

    public hasChosenRecipes(): boolean {
        return this.recipeSelection.length > 0;
    }

    public getPendingRecipeChooseLabel(): string {
        return `Tienes pendiente elegir las recetas del ${this.plan.name} para la entrega del ${this.getHumanShippmentDay()}`;
    }

    public assignPaymentOrder(paymentOrders: PaymentOrder[]): void {
        for (let paymentOrder of paymentOrders) {
            paymentOrder.billingDate.setHours(0, 0, 0, 0);
            this.billingDate.setHours(0, 0, 0, 0);

            if (this.billingDate.getTime() === paymentOrder.billingDate.getTime()) {
                this.paymentOrderId = paymentOrder.id;
                return;
            }
        }
    }

    public getPlanName(): string {
        return this.plan.name;
    }

    public getPlanVariantLabel(planVariantId: PlanVariantId): string {
        return this.plan.getPlanVariantLabel(planVariantId);
    }

    public getNumberOfRecipesOrReturn0(): number {
        const numberOfRecipes: string | number = this.plan.getNumberOfRecipesOfPlanVariant(this.planVariantId);
        return typeof numberOfRecipes === "string" ? parseInt(numberOfRecipes) : numberOfRecipes;
    }

    public getKitPrice(): number {
        const planVariant: PlanVariant | undefined = this.plan.getPlanVariantById(this.planVariantId);
        if (!!!planVariant) return 0;

        return Utils.roundTwoDecimals(
            //@ts-ignore
            planVariant.numberOfRecipes
                ? //@ts-ignore
                  this.getTotalPrice() / planVariant.numberOfRecipes
                : this.getTotalPrice()
        );
    }

    public getKitDiscount(): number {
        const planVariant: PlanVariant | undefined = this.plan.getPlanVariantById(this.planVariantId);
        if (!!!planVariant) return 0;

        return Utils.roundTwoDecimals(
            //@ts-ignore
            planVariant.numberOfRecipes
                ? //@ts-ignore
                  Math.round(this.discountAmount * 100) / planVariant.numberOfRecipes / 100
                : this.discountAmount
        );
    }

    public getFinalKitPrice(): number {
        const planVariant: PlanVariant | undefined = this.plan.getPlanVariantById(this.planVariantId);
        if (!!!planVariant) return 0;

        return Utils.roundTwoDecimals(
            //@ts-ignore
            planVariant.numberOfRecipes
                ? //@ts-ignore
                  (Math.round(this.getTotalPrice() * 100) - Math.round(this.discountAmount * 100)) / planVariant.numberOfRecipes / 100
                : (Math.round(this.getTotalPrice() * 100) - Math.round(this.discountAmount * 100)) / 100
        );
    }

    public getFinalPortionPrice(): number {
        const planVariant: PlanVariant | undefined = this.plan.getPlanVariantById(this.planVariantId);
        if (!!!planVariant) return 0;

        //@ts-ignore
        return Utils.roundTwoDecimals(this.getTotalPrice() / ((planVariant.numberOfPersons || 1) * (planVariant.numberOfRecipes || 1)));
    }

    public isGoingToBeShippedThisWeek(): boolean {
        const today: Date = new Date();
        const auxMinDay = new Date(this.week.minDay);
        auxMinDay.setDate(auxMinDay.getDate() - 1);

        return today >= auxMinDay && today <= this.week.maxDay;
    }

    public isInTimeToChooseRecipes(): boolean {
        const today = new Date();
        const fridayAt2359: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = 5 - today.getDay(); // 5 === day number of Friday

        fridayAt2359.setDate(today.getDate() + differenceInDays); // Delivery day of this week
        fridayAt2359.setHours(23, 59, 59);

        const todayWithDummyHours = new Date();
        todayWithDummyHours.setHours(0, 0, 0, 0);

        const weekMinDayWithDummyHours = new Date(this.week.minDay);
        weekMinDayWithDummyHours.setHours(0, 0, 0, 0);

        return (
            today < fridayAt2359 &&
            todayWithDummyHours < weekMinDayWithDummyHours &&
            (this.isActive() || this.isBilled()) &&
            this.isGoingToBeShippedNextWeek()
        );
    }

    public isGoingToBeShippedNextWeek(): boolean {
        const today: Date = new Date();
        const auxMinDay = new Date(this.week.minDay);
        auxMinDay.setDate(auxMinDay.getDate() - 1);
        const minDayDifferenceInDays = (auxMinDay.getTime() - today.getTime()) / (1000 * 3600 * 24);

        return minDayDifferenceInDays < 7 && today <= auxMinDay;
    }

    public moveShippingDateToDIfferentDayNumberOfSameWeek(newDayNumber: number): void {
        if (this.shippingDate.getDay() === newDayNumber) return;
        const differenceInDays = newDayNumber - this.shippingDate.getDay();

        this.shippingDate.setDate(this.shippingDate.getDate() + differenceInDays);
    }
    /**
     * Getter shippingDate
     * @return {Date}
     */
    public get shippingDate(): Date {
        return this._shippingDate;
    }

    /**
     * Getter state
     * @return {IOrderState}
     */
    public get state(): IOrderState {
        return this._state;
    }

    /**
     * Getter billingDate
     * @return {Date}
     */
    public get billingDate(): Date {
        return this._billingDate;
    }

    /**
     * Getter week
     * @return {Week}
     */
    public get week(): Week {
        return this._week;
    }

    /**
     * Getter planVariantId
     * @return {PlanVariantId}
     */
    public get planVariantId(): PlanVariantId {
        return this._planVariantId;
    }

    /**
     * Getter plan
     * @return {Plan}
     */
    public get plan(): Plan {
        return this._plan;
    }

    /**
     * Getter price
     * @return {number}
     */
    public get price(): number {
        return this._price;
    }

    /**
     * Getter discountAmount
     * @return {number}
     */
    public get discountAmount(): number {
        return this._discountAmount;
    }

    /**
     * Getter hasFreeShipping
     * @return {boolean}
     */
    public get hasFreeShipping(): boolean {
        return this._hasFreeShipping;
    }

    /**
     * Getter subscriptionId
     * @return {SubscriptionId}
     */
    public get subscriptionId(): SubscriptionId {
        return this._subscriptionId;
    }

    /**
     * Getter recipesVariantsIds
     * @return {RecipeVariantId[]}
     */
    public get recipesVariantsIds(): RecipeVariantId[] {
        return this._recipesVariantsIds;
    }

    /**
     * Getter recipeSelection
     * @return {RecipeSelection[]}
     */
    public get recipeSelection(): RecipeSelection[] {
        return this._recipeSelection;
    }

    /**
     * Getter choseByAdmin
     * @return {boolean}
     */
    public get choseByAdmin(): boolean {
        return this._choseByAdmin;
    }

    /**
     * Getter firstDateOfRecipesSelection
     * @return {Date | undefined}
     */
    public get firstDateOfRecipesSelection(): Date | undefined {
        return this._firstDateOfRecipesSelection;
    }

    /**
     * Getter lastDateOfRecipesSelection
     * @return {Date | undefined}
     */
    public get lastDateOfRecipesSelection(): Date | undefined {
        return this._lastDateOfRecipesSelection;
    }

    /**
     * Getter paymentOrderId
     * @return {PaymentOrderId | undefined}
     */
    public get paymentOrderId(): PaymentOrderId | undefined {
        return this._paymentOrderId;
    }

    /**
     * Getter createdAt
     * @return {Date}
     */
    public get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * Getter customer
     * @return {Customer}
     */
    public get customer(): Customer {
        return this._customer;
    }

    /**
     * Getter counter
     * @return {number}
     */
    public get counter(): number {
        return this._counter;
    }

    /**
     * Getter counter
     * @return {boolean}
     */
    public get isFirstOrderOfSubscription(): boolean {
        return this._isFirstOrderOfSubscription;
    }

    /**
     * Setter shippingDate
     * @param {Date} value
     */
    public set shippingDate(value: Date) {
        this._shippingDate = value;
    }

    /**
     * Setter state
     * @param {IOrderState} value
     */
    public set state(value: IOrderState) {
        this._state = value;
    }

    /**
     * Setter billingDate
     * @param {Date} value
     */
    public set billingDate(value: Date) {
        this._billingDate = value;
    }

    /**
     * Setter week
     * @param {Week} value
     */
    public set week(value: Week) {
        this._week = value;
    }

    /**
     * Setter planVariantId
     * @param {PlanVariantId} value
     */
    public set planVariantId(value: PlanVariantId) {
        this._planVariantId = value;
    }

    /**
     * Setter plan
     * @param {Plan} value
     */
    public set plan(value: Plan) {
        this._plan = value;
    }

    /**
     * Setter price
     * @param {number} value
     */
    public set price(value: number) {
        this._price = value;
    }

    /**
     * Setter discountAmount
     * @param {number} value
     */
    public set discountAmount(value: number) {
        this._discountAmount = value;
    }

    /**
     * Setter hasFreeShipping
     * @param {boolean} value
     */
    public set hasFreeShipping(value: boolean) {
        this._hasFreeShipping = value;
    }

    /**
     * Setter subscriptionId
     * @param {SubscriptionId} value
     */
    public set subscriptionId(value: SubscriptionId) {
        this._subscriptionId = value;
    }

    /**
     * Setter recipesVariantsIds
     * @param {RecipeVariantId[]} value
     */
    public set recipesVariantsIds(value: RecipeVariantId[]) {
        this._recipesVariantsIds = value;
    }

    /**
     * Setter recipeSelection
     * @param {RecipeSelection[]} value
     */
    public set recipeSelection(value: RecipeSelection[]) {
        this._recipeSelection = value;
    }

    /**
     * Setter choseByAdmin
     * @param {boolean} value
     */
    public set choseByAdmin(value: boolean) {
        this._choseByAdmin = value;
    }

    /**
     * Setter firstDateOfRecipesSelection
     * @param {Date | undefined}
     */
    public set firstDateOfRecipesSelection(value: Date | undefined) {
        this._firstDateOfRecipesSelection = value;
    }

    /**
     * Setter lastDateOfRecipesSelection
     * @param {Date | undefined}
     */
    public set lastDateOfRecipesSelection(value: Date | undefined) {
        this._lastDateOfRecipesSelection = value;
    }

    /**
     * Setter paymentOrderId
     * @param {PaymentOrderId | undefined} value
     */
    public set paymentOrderId(value: PaymentOrderId | undefined) {
        this._paymentOrderId = value;
    }

    /**
     * Setter createdAt
     * @param {Date} value
     */
    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    /**
     * Setter customer
     * @param {Customer} value
     */
    public set customer(value: Customer) {
        this._customer = value;
    }

    /**
     * Setter counter
     * @param {number} value
     */
    public set counter(value: number) {
        this._counter = value;
    }

    /**
     * Setter isFirstOrderOfSubscription
     * @param {boolean} value
     */
    public set isFirstOrderOfSubscription(value: boolean) {
        this._isFirstOrderOfSubscription = value;
    }
}
