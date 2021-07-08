import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { PaymentOrder } from "../paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../paymentOrder/PaymentOrderId";
import { Plan } from "../plan/Plan";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";
import { Recipe } from "../recipe/Recipe";
import { RecipeId } from "../recipe/RecipeId";
import { RecipeVariantId } from "../recipe/RecipeVariant/RecipeVariantId";
import { SubscriptionId } from "../subscription/SubscriptionId";
import { Week } from "../week/Week";
import { OrderId } from "./OrderId";
import { IOrderState } from "./orderState/IOrderState";

export class Order extends Entity<Order> {
    private _shippingDate: Date;
    private _state: IOrderState;
    private _billingDate: Date;
    private _week: Week;
    private _planVariantId: PlanVariantId;
    private _plan: Plan;
    private _price: number;
    private _subscriptionId: SubscriptionId;
    private _recipesVariantsIds: RecipeVariantId[];
    private _recipes: Recipe[];
    private _paymentOrderId?: PaymentOrderId;

    constructor(
        shippingDate: Date,
        state: IOrderState,
        billingDate: Date,
        week: Week,
        planVariantId: PlanVariantId,
        plan: Plan,
        price: number,
        subscriptionId: SubscriptionId,
        recipeVariantsIds: RecipeVariantId[],
        recipes: Recipe[],
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
        this._subscriptionId = subscriptionId;
        this._recipesVariantsIds = recipeVariantsIds;
        this._paymentOrderId = paymentOrderId;
        this._recipes = recipes;
    }

    public isActive(): boolean {
        return this.state.isActive();
    }

    public isSkipped(): boolean {
        return this.state.isSkipped();
    }

    public skip(): void {
        this.state.toSkipped(this);
    }

    public getWeekLabel(): string {
        return this.week.getLabel();
    }

    public bill(): void {
        this.state.toBilled(this);
    }

    public cancel(): void {
        this.state.toCancelled(this);
    }

    public swapPlan(newPlan: Plan, newPlanVariantId: PlanVariantId): void {
        this.plan = newPlan;
        this.planVariantId = newPlanVariantId;
        this.recipes = [];
        this.recipesVariantsIds = [];
    }

    public getHumanShippmentDay(): string {
        return MomentTimeService.getDateHumanLabel(this.shippingDate);
    }

    public getHumanBillingDay(): string {
        return MomentTimeService.getDateHumanLabel(this.billingDate);
    }

    public hasChosenRecipes(): boolean {
        return this.recipes.length > 0;
    }

    public getPendingRecipeChooseLabel(): string {
        return `Tienes pendiente elegir las recetas del ${this.plan.name} para la entrega del ${this.getHumanShippmentDay()}`;
    }

    public assignPaymentOrder(paymentOrders: PaymentOrder[]): void {
        for (let paymentOrder of paymentOrders) {
            if (this.week.id.equals(paymentOrder.week.id)) {
                this.paymentOrderId = paymentOrder.id;
            }
        }
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
     * Getter recipes
     * @return {Recipe[]}
     */
    public get recipes(): Recipe[] {
        return this._recipes;
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
     * Setter recipes
     * @param {Recipe[]} value
     */
    public set recipes(value: Recipe[]) {
        this._recipes = value;
    }

    /**
     * Setter paymentOrderId
     * @param {PaymentOrderId | undefined} value
     */
    public set paymentOrderId(value: PaymentOrderId | undefined) {
        this._paymentOrderId = value;
    }
}
