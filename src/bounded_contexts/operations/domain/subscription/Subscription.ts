import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { CancellationReason } from "../cancellationReason/CancellationReason";
import { CouponId } from "../cupons/CouponId";
import { Customer } from "../customer/Customer";
import { Order } from "../order/Order";
import { OrderActive } from "../order/orderState/OrderActive";
import { Plan } from "../plan/Plan";
import { PlanFrequency } from "../plan/PlanFrequency";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";
import { RecipeVariantRestriction } from "../recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { ShippingZone } from "../shipping/ShippingZone";
import { Week } from "../week/Week";
import { SubscriptionId } from "./SubscriptionId";
import { ISubscriptionState } from "./subscriptionState/ISubscriptionState";

export class Subscription extends Entity<Subscription> {
    private _planVariantId: PlanVariantId;
    private _plan: Plan;
    private _frequency: PlanFrequency;
    private _cancellationReason?: CancellationReason;
    private _state: ISubscriptionState;
    private _restrictionComment: string;
    private _restriction?: RecipeVariantRestriction;
    private _billingDayOfWeek: number;
    private _customer: Customer;
    private _couponId?: CouponId;
    private _billingStartDate?: Date;
    private _creationDate: Date;
    private _couponChargesQtyApplied: number;
    private _price: number;

    constructor(
        planVariantId: PlanVariantId,
        plan: Plan,
        frequency: PlanFrequency,
        state: ISubscriptionState,
        restrictionComment: string,
        creationDate: Date,
        couponChargesQtyApplied: number,
        customer: Customer,
        price: number,
        restriction?: RecipeVariantRestriction,
        couponId?: CouponId,
        billingDayOfWeek?: number,
        billingStartDate?: Date,
        cancellationReason?: CancellationReason,
        subscriptionId?: SubscriptionId
    ) {
        super(subscriptionId);
        this._planVariantId = planVariantId;
        this._plan = plan;
        this._price = price;
        this._frequency = frequency;
        this._state = state;
        this._restriction = restriction;
        this._restrictionComment = restrictionComment;
        this._customer = customer;
        this._couponId = couponId;
        this._billingStartDate = billingStartDate;
        this._creationDate = creationDate;
        this._couponChargesQtyApplied = couponChargesQtyApplied;
        this._billingDayOfWeek = billingDayOfWeek || 6; // Saturday
        this._cancellationReason = cancellationReason;
    }

    public createNewOrders(shippingZone: ShippingZone, orderedWeeks: Week[]): Order[] {
        const orders: Order[] = [];
        const deliveryDate: Date = this.getFirstOrderShippingDate(2); // Tuesday
        const billingDate = MomentTimeService.getDayOfThisWeekByDayNumber(6); // Saturday

        for (let i = 0; i < 12; i++) {
            deliveryDate.setDate(deliveryDate.getDate() + MomentTimeService.getFrequencyOffset(this.frequency));
            if (i !== 0) billingDate.setDate(billingDate.getDate() + MomentTimeService.getFrequencyOffset(this.frequency));

            orders.push(
                new Order(
                    new Date(deliveryDate),
                    new OrderActive(),
                    i === 0 ? new Date() : new Date(billingDate),
                    orderedWeeks[i],
                    this.planVariantId,
                    this.plan,
                    this.plan.getPlanVariantPrice(this.planVariantId),
                    this._id,
                    [],
                    []
                )
            );
        }
        return orders;
    }

    public getFirstOrderShippingDate(shippingDayWeekNumber: number): Date {
        var today: Date = new Date();
        // today.setDate(today.getDate() + 5); // Testing days
        const deliveryDate: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = shippingDayWeekNumber - today.getDay();

        deliveryDate.setDate(today.getDate() + differenceInDays); // Delivery day (Tuesday) of this week

        return deliveryDate;
    }

    public billingStartDayHasToSkipWeeks(): boolean {
        const todayWeekDay: number = new Date().getDay();

        return todayWeekDay !== this.billingDayOfWeek && todayWeekDay >= 2;
    }

    public swapPlan(nextOrders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): void {
        // TO DO: Validations
        this.plan = newPlan;
        this.planVariantId = newPlanVariantId;

        for (let order of nextOrders) {
            order.swapPlan(newPlan, newPlanVariantId);
        }
    }

    public cancel(cancellationReason: CancellationReason, nextOrders: Order[]): void {
        this.cancellationReason = cancellationReason;

        for (let order of nextOrders) {
            order.cancel();
        }

        this.state.toCancelled(this);
    }

    public getPlanVariantLabel(): string {
        return this.plan.getPlanVariantLabel(this.planVariantId);
    }

    public getNextActiveOrder(orders: Order[]): Order | undefined {
        return orders.find((order) => order.isActive()); // TO DO: It works if orders is sorted ASC
    }

    public getNextSecondActiveOrder(orders: Order[]): Order | undefined {
        const nextOrder: Order | undefined = this.getNextActiveOrder(orders);
        if (!!!nextOrder) return undefined;

        return orders.find((order) => order.isActive() && !order.id.equals(nextOrder.id)); // TO DO: It works if orders is sorted ASC
    }

    public getNextShipmentLabel(orders: Order[]): string {
        const nextOrder = orders.find((order) => order.isActive());

        if (!!!nextOrder) return "No tienes una próxima entrega";

        return nextOrder.getHumanShippmentDay();
    }

    public getServingsLabel(): string {
        const servingsQty = this.plan.getServingsQuantity(this.planVariantId);

        if (servingsQty === 0) return "";

        return `${servingsQty} raciones a ${this.price / servingsQty} € por ración`;
    }

    public getPriceByFrequencyLabel(): string {
        return `Valor total: ${this.price} €/${this.frequency}`;
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
     * Getter frequency
     * @return {PlanFrequency}
     */
    public get frequency(): PlanFrequency {
        return this._frequency;
    }

    /**
     * Getter state
     * @return {ISubscriptionState}
     */
    public get state(): ISubscriptionState {
        return this._state;
    }

    /**
     * Getter restriction
     * @return {RecipeVariantRestriction | undefined}
     */
    public get restriction(): RecipeVariantRestriction | undefined {
        return this._restriction;
    }

    /**
     * Getter billingStartDate
     * @return {Date | undefined}
     */
    public get billingStartDate(): Date | undefined {
        return this._billingStartDate;
    }

    /**
     * Getter customer
     * @return {Customer}
     */
    public get customer(): Customer {
        return this._customer;
    }

    /**
     * Getter price
     * @return {number}
     */
    public get price(): number {
        return this._price;
    }

    /**
     * Getter couponId
     * @return {CouponId | undefined}
     */
    public get couponId(): CouponId | undefined {
        return this._couponId;
    }

    /**
     * Getter creationDate
     * @return {Date}
     */
    public get creationDate(): Date {
        return this._creationDate;
    }

    /**
     * Getter couponChargesQtyApplied
     * @return {number}
     */
    public get couponChargesQtyApplied(): number {
        return this._couponChargesQtyApplied;
    }

    /**
     * Getter cancellationReason
     * @return {CancellatioNReason | undefined}
     */
    public get cancellationReason(): CancellationReason | undefined {
        return this._cancellationReason;
    }

    /**
     * Getter restrictionComment
     * @return {string}
     */
    public get restrictionComment(): string {
        return this._restrictionComment;
    }

    /**
     * Getter billingDayOfWeek
     * @return {number}
     */
    public get billingDayOfWeek(): number {
        return this._billingDayOfWeek;
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
     * Setter frequency
     * @param {PlanFrequency} value
     */
    public set frequency(value: PlanFrequency) {
        this._frequency = value;
    }

    /**
     * Setter state
     * @param {ISubscriptionState} value
     */
    public set state(value: ISubscriptionState) {
        this._state = value;
    }

    /**
     * Setter restriction
     * @param {RecipeVariantRestriction  | undefined} value
     */
    public set restriction(value: RecipeVariantRestriction | undefined) {
        this._restriction = value;
    }

    /**
     * Setter customer
     * @param {Customer} value
     */
    public set customer(value: Customer) {
        this._customer = value;
    }

    /**
     * Setter couponId
     * @param {CouponId | undefined} value
     */
    public set couponId(value: CouponId | undefined) {
        this._couponId = value;
    }
    /**
     * Setter billingStartDate
     * @param {Date | undefined} value
     */
    public set billingStartDate(value: Date | undefined) {
        this._billingStartDate = value;
    }

    /**
     * Setter cancellationReason
     * @param {CancellationReason | undefined} value
     */
    public set cancellationReason(value: CancellationReason | undefined) {
        this._cancellationReason = value;
    }

    /**
     * Setter creationDate
     * @param {Date} value
     */
    public set creationDate(value: Date) {
        this._creationDate = value;
    }

    /**
     * Setter couponChargesQtyApplied
     * @param {number} value
     */
    public set couponChargesQtyApplied(value: number) {
        this._couponChargesQtyApplied = value;
    }

    /**
     * Setter restrictionComment
     * @param {string} value
     */
    public set restrictionComment(value: string) {
        this._restrictionComment = value;
    }

    /**
     * Setter billingDayOfWeek
     * @param {number} value
     */
    public set billingDayOfWeek(value: number) {
        this._billingDayOfWeek = value;
    }

    /**
     * Setter price
     * @param {number} value
     */
    public set price(value: number) {
        this._price = value;
    }
}
