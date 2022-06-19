// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard, GuardArgumentCollection } from "../../../../core/logic/Guard";
import { ShippingZoneRadio } from "./ShippingZoneRadio/ShippingZoneRadio";
import { ShippingZoneId } from "../shipping/ShippingZoneId";
import { Day } from "../day/Day";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Locale } from "../locale/Locale";

export class ShippingZone extends Entity<ShippingZone> {
    private _name: string;
    private _reference: string;
    private _cost: number;
    private _state: string;
    private _radio: ShippingZoneRadio;
    private _shippingDayOfWeek: Day;

    protected constructor(
        name: string,
        reference: string,
        cost: number,
        state: string,
        radio: ShippingZoneRadio,
        shippingDayOfWeek: Day,
        id?: ShippingZoneId
    ) {
        super(id);
        this._name = name;
        this._reference = reference;
        this._cost = cost;
        this._state = state;
        this._radio = radio;
        this._shippingDayOfWeek = shippingDayOfWeek;
    }

    public static create(
        name: string,
        reference: string,
        cost: number,
        state: string,
        radio: ShippingZoneRadio,
        shippingDayOfWeek: Day,
        id?: ShippingZoneId
    ): ShippingZone {
        const guardedArgs: GuardArgumentCollection = [
            { argument: name, argumentName: "El nombre de zona de envío" },
            { argument: reference, argumentName: "La referencia de zona de envío" },
            { argument: cost, argumentName: "El coste de envío" },
            { argument: radio, argumentName: "El radio de zona de envío" },
            { argument: shippingDayOfWeek, argumentName: "El día de entrega" },
        ];

        Guard.againstNullOrUndefinedOrEmptyBulk(guardedArgs);

        return new ShippingZone(name, reference, cost, state, radio, shippingDayOfWeek, id);
    }

    public updateShippingRadio(radio: ShippingZoneRadio): void {
        this.radio = radio;
    }

    public updateState(state: string): void {
        this.state = state;
    }

    public hasAddressInside(lat: number, lng: number): boolean {
        return this.radio.hasPointInside(lat, lng);
    }

    public getDayLabel(locale: Locale): string {
        return this.shippingDayOfWeek.getDayName(locale);
    }

    public getDayNumberOfWeek(): number {
        return this.shippingDayOfWeek.dayNumberOfWeek;
    }

    private getDifferenceDaysBetweenTodayAndShippingDate(): number {
        var today: Date = new Date();

        return this.getDayNumberOfWeek() - today.getDay();
    }

    public nextShippingDate(): Date {
        var today: Date = new Date();
        // today.setDate(today.getDate() + 5); // Testing days
        const deliveryDate: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = this.getDifferenceDaysBetweenTodayAndShippingDate();

        deliveryDate.setDate(today.getDate() + differenceInDays); // Delivery day of this week

        if (this.shippingDateHasToSkipWeek()) {
            deliveryDate.setDate(deliveryDate.getDate() + 7); // Delivery day of this week
        }

        deliveryDate.setHours(0, 0, 0, 0);

        return deliveryDate;
    }

    public shippingDateHasToSkipWeek(): boolean {
        var today: Date = new Date();

        return (
            today.getDay() >= this.getDayNumberOfWeek() ||
            today.getDay() === 0 ||
            today.getDay() === 6 ||
            (today.getDay() < this.getDayNumberOfWeek() && this.getDifferenceDaysBetweenTodayAndShippingDate() <= 2)
        );
    }

    public getHumanNextShippingDate(locale: Locale): string {
        return MomentTimeService.getDateHumanLabel(this.nextShippingDate(), locale);
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter reference
     * @return {string}
     */
    public get reference(): string {
        return this._reference;
    }

    /**
     * Getter cost
     * @return {number}
     */
    public get cost(): number {
        return this._cost;
    }

    /**
     * Getter state
     * @return {string}
     */
    public get state(): string {
        return this._state;
    }

    /**
     * Getter radio
     * @return {ShippingZoneRadio}
     */
    public get radio(): ShippingZoneRadio {
        return this._radio;
    }

    /**
     * Getter shippingDayOfWeek
     * @return {Day}
     */
    public get shippingDayOfWeek(): Day {
        return this._shippingDayOfWeek;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter reference
     * @param {String} value
     */
    public set reference(value: string) {
        this._reference = value;
    }

    /**
     * Setter cost
     * @param {number} value
     */
    public set cost(value: number) {
        this._cost = value;
    }

    /**
     * Setter reference
     * @param {string} value
     */
    public set state(value: string) {
        this._state = value;
    }

    /**
     * Setter radio
     * @param {ShippingZoneRadio} value
     */
    public set radio(value: ShippingZoneRadio) {
        this._radio = value;
    }

    /**
     * Setter shippingDayOfWeek
     * @param {Day} value
     */
    public set shippingDayOfWeek(value: Day) {
        this._shippingDayOfWeek = value;
    }
}
