import { Utils } from "../../../../../core/logic/Utils";
import { Entity } from "../../../../../core/domain/Entity";
import { PlanSku } from "../PlanSku";
import { PlanVariantAttribute } from "./PlanVariantAttribute";
import { PlanVariantId } from "./PlanVariantId";

export class PlanVariant extends Entity<PlanVariant> {
    private _sku: PlanSku;
    private _name: string;
    private _price: number;
    private _priceWithOffer?: number;
    private _attributes: PlanVariantAttribute[];
    private _description: string;
    private _isDefault: boolean;
    private _isDeleted: boolean;

    constructor(
        sku: PlanSku,
        name: string,
        price: number,
        attributes: PlanVariantAttribute[],
        description: string,
        isDefault: boolean,
        isDeleted: boolean,
        priceWithOffer?: number,
        planVariantId?: PlanVariantId
    ) {
        super(planVariantId);
        this._sku = sku;
        this._name = name;
        this._price = Math.trunc(price * 100) / 100;
        this._priceWithOffer = priceWithOffer ? Math.trunc(priceWithOffer * 100) / 100 : 0;
        this._attributes = attributes;
        this._description = description;
        this._isDefault = isDefault;
        this._isDeleted = isDeleted;
    }

    public getConcatenatedAttributesAsString(): string {
        return this.attributes.reduce((acc, att) => acc + att.value, "");
    }

    public getPaymentPrice(): number {
        return this.priceWithOffer || this.price;
    }

    public getLabel(): string {
        return (
            this.description ||
            this.attributes.reduce(
                (acc: string, attribute: PlanVariantAttribute) => (acc = `${acc} / ${attribute.key} ${attribute.value}`),
                ""
            )
        );
    }

    public getLabelWithPrice(): string {
        return `${this.getLabel()} / ${this.getPaymentPrice()} €`;
    }

    public getServingsQuantity(): number {
        return 0;
    }

    public getAuxIdFromAttributes(): string {
        return "";
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
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Getter isDefault
     * @return {boolean}
     */
    public get isDefault(): boolean {
        return this._isDefault;
    }

    /**
     * Getter isDeleted
     * @return {boolean}
     */
    public get isDeleted(): boolean {
        return this._isDeleted;
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

    /**
     * Setter description
     * @param {string} value
     */
    public set description(value: string) {
        this._description = value;
    }

    /**
     * Setter isDefault
     * @param {boolean} value
     */
    public set isDefault(value: boolean) {
        this._isDefault = value;
    }

    /**
     * Setter isDeleted
     * @param {boolean} value
     */
    public set isDeleted(value: boolean) {
        this._isDeleted = value;
    }
}
