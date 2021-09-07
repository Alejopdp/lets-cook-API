import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { CancellationReason } from "../cancellationReason/CancellationReason";
import { Coupon } from "../cupons/Cupon";
import { Customer } from "../customer/Customer";
import { Order } from "../order/Order";
import { OrderActive } from "../order/orderState/OrderActive";
import { PaymentOrder } from "../paymentOrder/PaymentOrder";
import { Plan } from "../plan/Plan";
import { IPlanFrequency } from "../plan/PlanFrequency/IPlanFrequency";
import { PlanVariantId } from "../plan/PlanVariant/PlanVariantId";
import { RecipeVariantRestriction } from "../recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { ShippingZone } from "../shipping/ShippingZone";
import { Week } from "../week/Week";
import { SubscriptionId } from "./SubscriptionId";
import { ISubscriptionState } from "./subscriptionState/ISubscriptionState";

export class Subscription extends Entity<Subscription> {
    private _planVariantId: PlanVariantId;
    private _plan: Plan;
    private _frequency: IPlanFrequency;
    private _cancellationReason?: CancellationReason;
    private _state: ISubscriptionState;
    private _restrictionComment: string;
    private _restriction?: RecipeVariantRestriction;
    private _billingDayOfWeek: number;
    private _customer: Customer;
    private _coupon?: Coupon;
    private _billingStartDate?: Date;
    private _createdAt: Date;
    private _couponChargesQtyApplied: number;
    private _price: number;

    constructor(
        planVariantId: PlanVariantId,
        plan: Plan,
        frequency: IPlanFrequency,
        state: ISubscriptionState,
        restrictionComment: string,
        createdAt: Date,
        customer: Customer,
        price: number,
        restriction?: RecipeVariantRestriction,
        coupon?: Coupon,
        couponChargesQtyApplied?: number,
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
        this._coupon = coupon;
        this._billingStartDate = billingStartDate;
        this._createdAt = createdAt;
        this._couponChargesQtyApplied = couponChargesQtyApplied || 0;
        this._billingDayOfWeek = billingDayOfWeek || 6; // Saturday
        this._cancellationReason = cancellationReason;
    }

    public createNewOrders(shippingZone: ShippingZone, orderedWeeks: Week[]): Order[] {
        const orders: Order[] = [];
        const deliveryDate: Date = this.getFirstOrderShippingDate(shippingZone.getDayNumberOfWeek());
        const billingDate = MomentTimeService.getDayOfThisWeekByDayNumber(6); // Saturday
        const hasFreeShipping = this._coupon?.type.type === "free"; // TO DO: Add coupon isType methods

        if (!this.firstShippingDateHasToSkipWeek(shippingZone.getDayNumberOfWeek())) billingDate.setDate(billingDate.getDate() - 7);

        if (this.frequency.isOneTime()) {
            orders.push(
                new Order(
                    new Date(deliveryDate),
                    new OrderActive(),
                    new Date(),
                    orderedWeeks[0],
                    this.planVariantId,
                    this.plan,
                    this.plan.getPlanVariantPrice(this.planVariantId),
                    hasFreeShipping ? 0 : this.getCouponDiscount(shippingZone.cost),
                    hasFreeShipping,
                    this._id,
                    [],
                    [],
                    false,
                    this.customer
                )
            );

            if (this.getCouponDiscount(shippingZone.cost) !== 0) this.couponChargesQtyApplied += 1;

            return orders;
        } else {
            for (let i = 0; i < 12; i++) {
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
                        hasFreeShipping ? 0 : this.getCouponDiscount(shippingZone.cost),
                        hasFreeShipping,
                        this._id,
                        [],
                        [],
                        false,
                        this.customer
                    )
                );

                if (this.getCouponDiscount(shippingZone.cost) !== 0) this.couponChargesQtyApplied += 1;
                deliveryDate.setDate(deliveryDate.getDate() + MomentTimeService.getFrequencyOffset(this.frequency));
            }
            return orders;
        }
    }

    public getCouponDiscount(shippingCost: number): number {
        if (!!!this.coupon) return 0;
        if (!!!this.isCouponApplyable()) return 0;

        return this.coupon.getDiscount(this.plan, this.planVariantId, shippingCost);
    }

    private isCouponApplyable(): boolean {
        return (
            (!!this.coupon && this.couponChargesQtyApplied <= this.coupon.maxChargeQtyValue) || this.coupon?.maxChargeQtyType === "all_fee"
        );
    }

    public getNewOrderAfterBilling(billedOrder: Order, newOrderWeek: Week, shippingZone: ShippingZone): Order {
        console.log("BILLED ORDER: ", billedOrder);
        console.log("NEW ORDER WEEK: ", newOrderWeek);
        const newBillingDate: Date = this.getNewOrderDateFrom(billedOrder.billingDate);
        const newShippingDate: Date = this.getNewOrderDateFrom(billedOrder.shippingDate);
        const hasFreeShipping = this._coupon?.type.type === "free"; // TO DO: Add coupon isType methods

        if (this.getCouponDiscount(shippingZone.cost) !== 0) this.couponChargesQtyApplied += 1;

        return new Order(
            newShippingDate,
            new OrderActive(),
            newBillingDate,
            newOrderWeek,
            this.planVariantId,
            this.plan,
            this.plan.getPlanVariantPrice(this.planVariantId),
            hasFreeShipping ? 0 : this.getCouponDiscount(shippingZone.cost),
            hasFreeShipping,
            this.id,
            [],
            [],
            false,
            this.customer
        );
    }

    public getNewOrderDateFrom(date: Date): Date {
        const newDate = new Date(date);
        if (this.frequency.isWeekly()) newDate.setDate(newDate.getDate() + 11 * 7);

        if (this.frequency.isBiweekly()) newDate.setDate(newDate.getDate() + 11 * 14);

        if (this.frequency.isMonthly()) newDate.setDate(newDate.getDate() + 11 * 28);

        return newDate;
    }

    public getFirstOrderShippingDate(shippingDayWeekNumber: number): Date {
        var today: Date = new Date();
        // today.setDate(today.getDate() + 5); // Testing days
        const deliveryDate: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = shippingDayWeekNumber - today.getDay();

        deliveryDate.setDate(today.getDate() + differenceInDays); // Delivery day of this week

        if (this.firstShippingDateHasToSkipWeek(shippingDayWeekNumber)) {
            deliveryDate.setDate(deliveryDate.getDate() + 7); // Delivery day of this week
        }

        return deliveryDate;
    }

    public firstShippingDateHasToSkipWeek(shippingWeekDayNumber: number): boolean {
        var today: Date = new Date();

        return today.getDay() >= shippingWeekDayNumber || shippingWeekDayNumber - today.getDay() <= 2;
    }

    public billingStartDayHasToSkipWeeks(): boolean {
        const todayWeekDay: number = new Date().getDay();

        return todayWeekDay !== this.billingDayOfWeek && todayWeekDay >= 1;
    }

    public swapPlan(nextOrders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): void {
        // TO DO: Validations
        this.plan = newPlan;
        this.planVariantId = newPlanVariantId;
        this.price = this.plan.getPlanVariantPrice(this.planVariantId);

        for (let order of nextOrders) {
            order.swapPlan(newPlan, newPlanVariantId);
        }
    }

    public cancel(cancellationReason: CancellationReason, nextOrders: Order[], paymentOrders: PaymentOrder[]): void {
        this.cancellationReason = cancellationReason;

        for (let order of nextOrders) {
            order.cancel(paymentOrders.find((paymentOrder) => paymentOrder.id.equals(order.paymentOrderId)));
        }

        this.state.toCancelled(this);
    }

    public getPlanVariantLabel(): string {
        return this.plan.getPlanVariantLabel(this.planVariantId);
    }

    public getNextChoosableRecipesOrder(orders: Order[] = []): Order | undefined {
        const order: Order | undefined = orders.find((order) => order.isInTimeToChooseRecipes());

        return order;
    }

    public getNextActiveOrder(orders: Order[] = []): Order | undefined {
        return orders.find((order) => order.isActive()); // TO DO: It works if orders is sorted ASC
    }

    public getNextOrderToShip(orders: Order[] = []): Order | undefined {
        return orders.find((order) => order.isActive() || order.state.title === "ORDER_BILLED"); // TO DO: It works if orders is sorted ASC
    }

    public getNextSecondActiveOrder(orders: Order[]): Order | undefined {
        const nextOrder: Order | undefined = this.getNextActiveOrder(orders);
        if (!!!nextOrder) return undefined;

        return orders.find((order) => order.isActive() && !order.id.equals(nextOrder.id)); // TO DO: It works if orders is sorted ASC
    }

    public getNextSecondOrderToShip(orders: Order[]): Order | undefined {
        const nextOrder: Order | undefined = this.getNextOrderToShip(orders);
        if (!!!nextOrder) return undefined;

        return orders.find((order) => (order.isActive() || order.state.title === "ORDER_BILLED") && !order.id.equals(nextOrder.id)); // TO DO: It works if orders is sorted ASC
    }

    public getNextShipmentLabel(orders: Order[] = []): string {
        const nextOrder = orders.find((order) => order.isActive());

        if (!!!nextOrder) return "No tienes una próxima entrega";

        return nextOrder.getHumanShippmentDay();
    }

    public getServingsQuantity(): number {
        return this.plan.getServingsQuantity(this.planVariantId);
    }

    public getServingsLabel(): string {
        const servingsQty = this.plan.getServingsQuantity(this.planVariantId);

        if (servingsQty === 0) return "";

        return `${servingsQty} raciones a ${this.price / servingsQty} € por ración`;
    }

    public getPriceByFrequencyLabel(): string {
        return `Valor total: ${this.price} €/ ${this.frequency.getLabel()}`;
    }

    public getPrice(): number {
        return this.plan.getPlanVariantPrice(this.planVariantId);
    }

    public getPriceWithDiscount(shippingCost: number): number {
        return this.getPrice() - this.getCouponDiscount(shippingCost) + shippingCost;
    }

    public getMaxRecipesQty(): number {
        //@ts-ignore
        return this.plan.getPlanVariantById(this.planVariantId)?.numberOfRecipes || 0;
    }

    public updateRestriction(newRestriction: RecipeVariantRestriction, comment?: string): void {
        this.restriction = newRestriction;

        if (comment) this.restrictionComment = comment;
    }

    public changePlanVariant(variantId: PlanVariantId, orders: Order[], paymentOrders: PaymentOrder[]): void {
        // const planVariant: PlanVariant | undefined = this.plan.getPlanVariantById(variantId);
        // if (!!!planVariant) throw new Error("La variante ingresada no existe");
        // const paymentOrderOrderMap: { [paymentOrderId: string]: Order };
        // orders.forEach((order) => {
        //     order.price = planVariant.getPaymentPrice();
        //     if (order.discountAmount !== 0 && !!this.coupon && !this.coupon?.isFreeShippingCoupon()) {
        //         order.discountAmount = this.coupon.getDiscount(this.plan, variantId, 0); // ShippingCost dummy if it is not a free shipping coupon
        //     }
        //     paymentOrderOrderMap[order.paymentOrderId?.value! as string] = order;
        // });
        // paymentOrders.forEach((paymentOrder) => {
        //     paymentOrder.amount;
        // });
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
     * @return {IPlanFrequency}
     */
    public get frequency(): IPlanFrequency {
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
     * Getter coupon
     * @return {Coupon | undefined}
     */
    public get coupon(): Coupon | undefined {
        return this._coupon;
    }

    /**
     * Getter createdAt
     * @return {Date}
     */
    public get createdAt(): Date {
        return this._createdAt;
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
     * @param {IPlanFrequency} value
     */
    public set frequency(value: IPlanFrequency) {
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
     * Setter coupon
     * @param {Coupon | undefined} value
     */
    public set coupon(value: Coupon | undefined) {
        this._coupon = value;
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
     * Setter createdAt
     * @param {Date} value
     */
    public set createdAt(value: Date) {
        this._createdAt = value;
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
