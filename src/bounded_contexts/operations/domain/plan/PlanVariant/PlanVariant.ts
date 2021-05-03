import { PlanSku } from "../PlanSku";
import { PlanVariantAttribute } from "./PlanVariantAttribute";

export class PlanVariant {
    private _sku: PlanSku;
    private _name: string;
    private _price: number;
    private _priceWithOffer?: number;
    private _attributes: PlanVariantAttribute[];

    constructor(sku: PlanSku, name: string, price: number, attributes: PlanVariantAttribute[], priceWithOffer?: number) {
        this._sku = sku;
        this._name = name;
        this._price = price;
        this._priceWithOffer = priceWithOffer;
        this._attributes = attributes;
    }

    /**
     * Getter sku
     * @return {PlanSku}
     */
    public get sku(): PlanSku {
        return this._sku;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter price
     * @return {number}
     */
    public get price(): number {
        return this._price;
    }

    /**
     * Getter priceWithOffer
     * @return {number | undefined}
     */
    public get priceWithOffer(): number | undefined {
        return this._priceWithOffer;
    }

    /**
     * Getter attributes
     * @return {PlanVariantAttribute[]}
     */
    public get attributes(): PlanVariantAttribute[] {
        return this._attributes;
    }

    /**
     * Setter sku
     * @param {PlanSku} value
     */
    public set sku(value: PlanSku) {
        this._sku = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter price
     * @param {number} value
     */
    public set price(value: number) {
        this._price = value;
    }

    /**
     * Setter priceWithOffer
     * @param {number | undefined} value
     */
    public set priceWithOffer(value: number | undefined) {
        this._priceWithOffer = value;
    }

    /**
     * Setter attributes
     * @param {PlanVariantAttribute} value
     */
    public set attributes(value: PlanVariantAttribute[]) {
        this._attributes = value;
    }
}
