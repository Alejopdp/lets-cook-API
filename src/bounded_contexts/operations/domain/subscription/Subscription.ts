import { Entity } from "../../../../core/domain/Entity";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { CancellationReason } from "../cancellationReason/CancellationReason";
import { CouponState } from "../cupons/CouponState";
import { Coupon } from "../cupons/Cupon";
import { Customer } from "../customer/Customer";
import { Locale } from "../locale/Locale";
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
        this._price = Math.round(price * 100) / 100;
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
        const skipWeek: boolean = new Date().getDay() === 0;
        if (this.coupon) this.coupon.addApplication(this.customer);

        if (!this.firstShippingDateHasToSkipWeek(shippingZone.getDayNumberOfWeek())) billingDate.setDate(billingDate.getDate() - 7);

        if (this.frequency.isOneTime()) {
            orders.push(
                new Order(
                    new Date(deliveryDate),
                    new OrderActive(),
                    new Date(),
                    orderedWeeks[skipWeek ? 1 : 0],
                    this.planVariantId,
                    this.plan,
                    this.plan.getPlanVariantPrice(this.planVariantId),
                    hasFreeShipping ? 0 : this.getCouponDiscountOr0IfIsNotApplyable(shippingZone.cost),
                    hasFreeShipping,
                    this._id,
                    [],
                    [],
                    false,
                    this.customer,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    true
                )
            );

            if (this.getCouponDiscountOr0IfIsNotApplyable(shippingZone.cost) !== 0 || hasFreeShipping) this.couponChargesQtyApplied += 1;

            return orders;
        } else {
            for (let i = 0; i < 12; i++) {
                if (i !== 0) billingDate.setDate(billingDate.getDate() + MomentTimeService.getFrequencyOffset(this.frequency));

                orders.push(
                    new Order(
                        new Date(deliveryDate),
                        new OrderActive(),
                        i === 0 ? new Date() : new Date(billingDate),
                        orderedWeeks[skipWeek ? i + 1 : i],
                        this.planVariantId,
                        this.plan,
                        this.plan.getPlanVariantPrice(this.planVariantId),
                        hasFreeShipping ? 0 : this.getCouponDiscountOr0IfIsNotApplyable(shippingZone.cost),
                        hasFreeShipping && this.isCouponApplyable(),
                        this._id,
                        [],
                        [],
                        false,
                        this.customer,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        i === 0
                    )
                );
                if (this.getCouponDiscountOr0IfIsNotApplyable(shippingZone.cost) !== 0 || hasFreeShipping) this.couponChargesQtyApplied += 1;
                deliveryDate.setDate(deliveryDate.getDate() + MomentTimeService.getFrequencyOffset(this.frequency));
            }
            return orders;
        }
    }

    public getCouponDiscount(shippingCost: number): number {
        return this.coupon?.getDiscount(this.plan, this.planVariantId, shippingCost) ?? 0

    }
    public getCouponDiscountOr0IfIsNotApplyable(shippingCost: number): number {
        if (!!!this.coupon) return 0;
        if (!this.isCouponApplyable()) return 0;

        return this.coupon.getDiscount(this.plan, this.planVariantId, shippingCost);
    }


    private isCouponApplyable(): boolean {
        return (
            ((!!this.coupon && this.couponChargesQtyApplied < this.coupon.maxChargeQtyValue) ||
                this.coupon?.maxChargeQtyType === "all_fee") &&
            this.coupon.state !== CouponState.DELETED
        );
    }

    public addCoupon(orders: Order[], paymentOrders: PaymentOrder[], coupon: Coupon, shippingCost: number): void {
        this.coupon = coupon;
        this.couponChargesQtyApplied = 0;
        for (let order of orders) {
            this.applyCoupon(order, paymentOrders.find((po) => po.id.equals(order.paymentOrderId!))!, shippingCost);
        }

        coupon.addApplication(this.customer);
    }

    public skipOrder(orderToSkip: Order, relatedPaymentOrder: PaymentOrder): void {
        // TODO: Mover descuento para free shipping tmb
        if (orderToSkip.discountAmount > 0) this.couponChargesQtyApplied--
        orderToSkip.skip(relatedPaymentOrder)

    }

    private applyCoupon(order: Order, paymentOrder: PaymentOrder, shippingCost: number): void {
        const hasFreeShipping = this._coupon?.type.type === "free" && this.getCouponDiscountOr0IfIsNotApplyable(shippingCost) > 0;

        if (order.isActive()) {
            const oldDiscountAmount = order.discountAmount;
            const newDiscountAmount = hasFreeShipping ? 0 : this.getCouponDiscountOr0IfIsNotApplyable(shippingCost);
            if (hasFreeShipping) paymentOrder.hasFreeShipping = hasFreeShipping;

            paymentOrder.discountAmount =
                Math.round(paymentOrder.discountAmount * 100) / 100 +
                Math.round(newDiscountAmount * 100) / 100 -
                Math.round(oldDiscountAmount * 100) / 100;

            order.hasFreeShipping = hasFreeShipping;
            order.discountAmount = newDiscountAmount;

            if (order.discountAmount > 0 || hasFreeShipping) this.couponChargesQtyApplied = this.couponChargesQtyApplied + 1;
        }
    }

    public getNewOrderAfterBilling(billedOrder: Order, newOrderWeek: Week, shippingZone: ShippingZone): Order {
        const newBillingDate: Date = this.getNewOrderDateFrom(billedOrder.billingDate);
        const newShippingDate: Date = this.getNewOrderDateFrom(billedOrder.shippingDate);
        const hasFreeShipping = this._coupon?.type.type === "free" && this.isCouponApplyable(); // TO DO: Add coupon isType methods

        if (this.getCouponDiscountOr0IfIsNotApplyable(shippingZone.cost) !== 0 || hasFreeShipping)
            this.couponChargesQtyApplied = this.couponChargesQtyApplied + 1;

        return new Order(
            newShippingDate,
            new OrderActive(),
            newBillingDate,
            newOrderWeek,
            this.planVariantId,
            this.plan,
            this.plan.getPlanVariantPrice(this.planVariantId),
            hasFreeShipping ? 0 : this.getCouponDiscountOr0IfIsNotApplyable(shippingZone.cost),
            hasFreeShipping && this.isCouponApplyable(),
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
        // var today: Date = new Date();
        // today.setDate(today.getDate() + 5); // Testing days
        const deliveryDate: Date = new Date(this.createdAt.getFullYear(), this.createdAt.getMonth());
        const differenceInDays = shippingDayWeekNumber - this.createdAt.getDay();

        deliveryDate.setDate(this.createdAt.getDate() + differenceInDays); // Delivery day of this week

        if (this.firstShippingDateHasToSkipWeek(shippingDayWeekNumber)) {
            deliveryDate.setDate(deliveryDate.getDate() + 7); // Delivery day of this week
        }

        return deliveryDate;
    }

    public firstShippingDateHasToSkipWeek(shippingWeekDayNumber: number): boolean {
        var todayDayNumber: number = new Date().getDay();

        return (
            todayDayNumber >= shippingWeekDayNumber || shippingWeekDayNumber - todayDayNumber <= 2 || todayDayNumber === 0
            // todayDayNumber === 6
        );
    }

    public billingStartDayHasToSkipWeeks(): boolean {
        const todayWeekDay: number = new Date().getDay();

        return todayWeekDay !== this.billingDayOfWeek && todayWeekDay >= 1;
    }

    public swapPlan(nextOrders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId, shippingCost: number): void {
        // TO DO: Validations
        this.plan = newPlan;
        this.planVariantId = newPlanVariantId;
        this.price = this.plan.getPlanVariantPrice(this.planVariantId);
        var couponDiscount = 0;

        if (!!this.coupon) couponDiscount = this.coupon.getDiscount(newPlan, newPlanVariantId, shippingCost);

        for (let order of nextOrders) {
            order.swapPlan(newPlan, newPlanVariantId, couponDiscount);
        }
    }

    public cancel(cancellationReason: CancellationReason, nextOrders: Order[], paymentOrders: PaymentOrder[]): void {
        cancellationReason.date = new Date();
        this.cancellationReason = cancellationReason;

        for (let order of nextOrders) {
            order.cancel(paymentOrders.find((paymentOrder) => paymentOrder.id.equals(order.paymentOrderId)));
        }

        this.state.toCancelled(this);
    }

    public isActive(): boolean {
        return this.state.isActive();
    }

    public isCancelled(): boolean {
        return this.state.isCancelled()
    }

    public getPlanVariantLabel(locale: Locale): string {
        return this.plan.getPlanVariantLabel(this.planVariantId, locale);
    }

    public getNextChoosableRecipesOrder(orders: Order[] = []): Order | undefined {
        const order: Order | undefined = orders.find((order) => order.isInTimeToChooseRecipes());

        return order;
    }

    public getNextActiveOrder(orders: Order[] = []): Order | undefined {
        return orders.find((order) => order.isActive()); // TO DO: It works if orders is sorted ASC
    }

    public getNextOrderToShip(orders: Order[] = []): Order | undefined {
        return orders.find((order) => order.isActive() || order.isBilled()); // TO DO: It works if orders is sorted ASC
    }

    public getNextSecondActiveOrder(orders: Order[]): Order | undefined {
        const nextOrder: Order | undefined = this.getNextActiveOrder(orders);
        if (!!!nextOrder) return undefined;

        return orders.find((order) => (order.isActive() || order.isBilled()) && !order.id.equals(nextOrder.id)); // TO DO: It works if orders is sorted ASC
    }

    public getNextSecondOrderToShip(orders: Order[]): Order | undefined {
        const nextOrder: Order | undefined = this.getNextOrderToShip(orders);
        if (!!!nextOrder) return undefined;

        return orders.find((order) => (order.isActive() || order.isBilled()) && !order.id.equals(nextOrder.id)); // TO DO: It works if orders is sorted ASC
    }

    public getNextShipmentLabel(orders: Order[] = [], locale: Locale): string {
        const nextOrder = orders.find((order) => order.isActive() || order.isBilled());

        if (!!!nextOrder) return "No tienes una próxima entrega";

        return nextOrder.getHumanShippmentDay(locale);
    }

    public getServingsQuantity(): number {
        return this.plan.getServingsQuantity(this.planVariantId);
    }

    public getPortionsQuantity(): number {
        return this.plan.getPortionsQuantity(this.planVariantId);
    }

    public getPortionPrice(): number {
        return this.plan.getPortionPrice(this.planVariantId);
    }

    public getServingsLabel(): string {
        const servingsQty = this.plan.getServingsQuantity(this.planVariantId);

        if (servingsQty === 0) return "";

        return `${servingsQty} raciones a ${Math.round((this.price / servingsQty + Number.EPSILON) * 100) / 100} € por ración`;
    }

    public getPriceByFrequencyLabel(locale: Locale): string {
        const text = { es: { totalValue: "Valor total:" }, en: { totalValue: "Total value:" }, ca: { totalValue: "Valor total:" } };

        return `${text[locale].totalValue} ${this.getPrice()} €/ ${this.frequency.getLabel(locale)}`;
    }

    public getPrice(): number {
        return this.plan.getPlanVariantPrice(this.planVariantId);
    }

    public getCustomerLatitude(): number {
        if (!this.customer.shippingAddress?.latitude) throw new Error("El usuario no tiene una direccion de entrega")
        return this.customer.shippingAddress?.latitude!
    }

    public getCustomerLongitude(): number {
        if (!this.customer.shippingAddress?.longitude) throw new Error("El usuario no tiene una direccion de entrega")
        return this.customer.shippingAddress?.longitude!
    }

    public getPriceWithDiscount(shippingCost: number): number {
        return this.getPrice() - this.getCouponDiscountOr0IfIsNotApplyable(shippingCost) + shippingCost;
    }

    public getMaxRecipesQty(): number {
        //@ts-ignore
        return this.plan.getPlanVariantById(this.planVariantId)?.numberOfRecipes || 0;
    }

    public updateRestriction(newRestriction: RecipeVariantRestriction, comment?: string): void {
        this.restriction = newRestriction;

        if (comment) this.restrictionComment = comment;
    }

    public getStateHumanTitle(locale: Locale): string {
        return this.state.getHumanTitle(locale);
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

    // IMPORTANT: It assumes that the shipping order was never skipped
    public isAOneTimeSubAndWasDelivered(order: Order): boolean {
        return this.frequency.isOneTime() && order.shippingDate >= new Date();
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
