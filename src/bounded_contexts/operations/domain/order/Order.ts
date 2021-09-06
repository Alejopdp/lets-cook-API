import { logger } from "../../../../../config";
import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
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
        firstDateOfRecipesSelection?: Date,
        lastDateOfRecipesSelection?: Date,
        paymentOrderId?: PaymentOrderId,
        orderId?: OrderId
    ) {
        super(orderId);
        this._shippingDate = shippingDate;
        this._state = state;
        this._billingDate = billingDate;
        this._week = week;
        this._planVariantId = planVariantId;
        this._plan = plan;
        this._price = price;
        this._discountAmount = discountAmount;
        this._hasFreeShipping = hasFreeShipping;
        this._subscriptionId = subscriptionId;
        this._recipesVariantsIds = recipeVariantsIds;
        this._recipeSelection = recipeSelection;
        this._choseByAdmin = choseByAdmin;
        this._firstDateOfRecipesSelection = firstDateOfRecipesSelection;
        this._lastDateOfRecipesSelection = lastDateOfRecipesSelection;
        this._paymentOrderId = paymentOrderId;
    }

    public updateRecipes(recipeSelection: RecipeSelection[], isAdminChoosing: boolean): void {
        const planVariant: PlanVariant = this.plan.getPlanVariantById(this.planVariantId)!;
        const totalIncomingRecipes = recipeSelection.reduce((acc, recipeSelection) => acc + recipeSelection.quantity, 0);

        if (totalIncomingRecipes > planVariant.getServingsQuantity())
            throw new Error(`No puedes elegir mas de ${planVariant.getServingsQuantity()}`);

        for (let selection of recipeSelection) {
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

    public skip(): void {
        this.state.toSkipped(this);
    }

    public reactivate(): void {
        this.state.toActive(this);
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

    public bill(): void {
        this.state.toBilled(this);
    }

    public cancel(paymentOrder?: PaymentOrder): void {
        if (paymentOrder && !this.isCancelled()) {
            paymentOrder.discountOrderAmount(this);
        }

        if (paymentOrder && paymentOrder.amount === 0) paymentOrder.toCancelled([]);

        this.state.toCancelled(this);
    }

    public getTotalPrice(): number {
        return this.price;
    }

    public swapPlan(newPlan: Plan, newPlanVariantId: PlanVariantId): void {
        this.plan = newPlan;
        this.planVariantId = newPlanVariantId;
        this.recipeSelection = [];
        this.recipesVariantsIds = [];
    }

    public getDdMmYyyyShipmentDate(): string {
        return MomentTimeService.getDdMmYyyy(this.shippingDate);
    }
    public getHumanShippmentDay(): string {
        return MomentTimeService.getDateHumanLabel(this.shippingDate);
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

    public isActualWeek(): boolean {
        const date: Date = new Date();

        return date >= this.week.minDay && date <= this.week.maxDay;
    }

    public isInTimeToChooseRecipes(): boolean {
        const today = new Date();
        const fridayAt2359: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = 5 - today.getDay();

        fridayAt2359.setDate(today.getDate() + differenceInDays); // Delivery day of this week
        fridayAt2359.setHours(23, 59, 59);

        const todayWithDummyHours = new Date();
        todayWithDummyHours.setHours(0, 0, 0, 0);

        const weekMinDayWithDummyHours = new Date(this.week.minDay);
        weekMinDayWithDummyHours.setHours(0, 0, 0, 0);

        return (
            today < fridayAt2359 &&
            todayWithDummyHours < weekMinDayWithDummyHours &&
            (this.isActive() || this.state.title === "ORDER_BILLED") &&
            this.isNextWeek()
        );
    }

    public isNextWeek(): boolean {
        const date: Date = new Date();
        const minDayDifferenceInDays = (this.week.minDay.getTime() - date.getTime()) / (1000 * 3600 * 24);

        return minDayDifferenceInDays < 7 && date <= this.week.minDay;
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
}
