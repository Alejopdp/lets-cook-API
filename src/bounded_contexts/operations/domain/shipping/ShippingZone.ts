// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard, GuardArgumentCollection } from "../../../../core/logic/Guard";
import { ShippingZoneRadio } from "./ShippingZoneRadio/ShippingZoneRadio";
import { ShippingZoneId } from "../shipping/ShippingZoneId";
import { Day } from "../day/Day";

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
            { argument: cost, argumentName: "El costo de envío" },
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
