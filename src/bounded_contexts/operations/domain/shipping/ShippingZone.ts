import { updateShippingZone } from "./../../useCases/updateShippingZone/index";
// Principal
import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { ShippingZoneRadio } from "./ShippingZoneRadio/ShippingZoneRadio";
import { ShippingZoneId } from "../shipping/ShippingZoneId";

export class ShippingZone extends Entity<ShippingZone> {
    private _name: string;
    private _reference: string;
    private _cost: number;
    private _state: string;
    private _radio: ShippingZoneRadio;

    protected constructor(name: string, reference: string, cost: number, state: string, radio: ShippingZoneRadio, id?: ShippingZoneId) {
        super(id);
        this._name = name;
        this._reference = reference;
        this._cost = cost;
        this._state = state;
        this._radio = radio;
    }

    public static create(
        name: string,
        reference: string,
        cost: number,
        state: string,
        radio: ShippingZoneRadio,
        id?: ShippingZoneId
    ): ShippingZone {
        return new ShippingZone(name, reference, cost, state, radio, id);
    }

    public updateShippingRadio(radio: ShippingZoneRadio): void {
        this.radio = radio;
    }

    public updateState(state: string): void {
        this.state = state;
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
}
