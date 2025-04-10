import { Utils } from "../../../../../core/logic/Utils";
import { Entity } from "../../../../../core/domain/Entity";
import { PlanSku } from "../PlanSku";
import { PlanVariantAttribute } from "./PlanVariantAttribute";
import { PlanVariantId } from "./PlanVariantId";
import { Locale } from "../../locale/Locale";

export class PlanVariant extends Entity<PlanVariant> {
    private _sku: PlanSku;
    private _name: string;
    private _price: number;
    private _priceWithOffer?: number;
    private _attributes: PlanVariantAttribute[];
    private _description: string;
    private _isDefault: boolean;
    private _isDeleted: boolean;
    private _numberOfPersons?: number;
    private _numberOfRecipes?: number;

    constructor(
        sku: PlanSku,
        name: string,
        price: number,
        attributes: PlanVariantAttribute[],
        description: string,
        isDefault: boolean,
        isDeleted: boolean,
        priceWithOffer?: number,
        planVariantId?: PlanVariantId,
        numberOfPersons?: number,
        numberOfRecipes?: number
    ) {
        super(planVariantId);
        this._sku = sku;
        this._name = name;
        this._price = Math.round(price * 100) / 100;
        this._priceWithOffer = priceWithOffer ? Math.round(priceWithOffer * 100) / 100 : 0;
        this._attributes = attributes;
        this._description = description;
        this._isDefault = isDefault;
        this._isDeleted = isDeleted;
        this._numberOfPersons = numberOfPersons;
        this._numberOfRecipes = numberOfRecipes;
    }

    public getConcatenatedAttributesAsString(): string {
        return this.attributes.reduce((acc, att) => acc + att.value, "");
    }

    public getPaymentPrice(): number {
        return this.priceWithOffer || this.price;
    }

    public getLabel(locale: Locale = Locale.es): string {
        const texts = {
            es: { recipesFor: "recetas para", persons: "personas" },
            en: { recipesFor: "recipes for", persons: "persons" },
            ca: { recipesFor: "receptes per", persons: "persones" },
        };
        if (!!this.description) return this.description;
        var concatenatedAttributes = this.attributes.reduce(
            (acc: string, attribute: PlanVariantAttribute) => (acc = `${acc} / ${attribute.key} ${attribute.value}`),
            ""
        );

        if (!!this.numberOfPersons && !!this.numberOfRecipes)
            return `${this.numberOfRecipes} ${texts[locale].recipesFor} ${this.numberOfPersons} ${texts[locale].persons}`;
        if (!!this.numberOfPersons) concatenatedAttributes = `${this.numberOfPersons} / ${concatenatedAttributes}`;
        if (!!this.numberOfRecipes) concatenatedAttributes = `${this.numberOfRecipes} / ${concatenatedAttributes}`;

        return concatenatedAttributes;
    }

    public getLabelWithPrice(locale: Locale = Locale.es): string {
        return `${this.getLabel(locale)} / ${this.getPaymentPrice()} €`;
    }

    public getServingsQuantity(): number {
        return this.numberOfPersons || 0;
    }

    public getPortionsQuantity(): number {
        if (!this.numberOfRecipes || !this.numberOfPersons) return 0;

        return this.numberOfPersons * this.numberOfRecipes;
    }

    public getPortionPrice(discount: number = 0): number {
        return Utils.roundTwoDecimals(this.getPaymentPrice() / this.getPortionsQuantity());
    }

    public getKitPrice(): number {
        return !!this.numberOfRecipes ? this.getPaymentPrice() / this.numberOfRecipes : this.getPaymentPrice();
    }

    public getFinalKitPrice(): number {
        return Utils.roundTwoDecimals(
            !!this.numberOfRecipes
                ? Math.round(this.getPaymentPrice() * 100) / this.numberOfRecipes / 100
                : Math.round(this.getPaymentPrice() * 100) / 100
        );
    }

    public getNumberOfRecipes(): number {
        return this.numberOfRecipes || 0;
    }

    public getAuxIdFromAttributes(): string {
        return "";
    }

    public getAttributesAndValues(attributes: { [key: string]: (string | number)[] }): { [key: string]: (string | number)[] } {
        if (!!this.numberOfPersons) {
            const personasValues = attributes["Personas"];

            attributes["Personas"] = personasValues.includes(this.numberOfPersons)
                ? personasValues
                : [...personasValues, this.numberOfPersons];
        }
        if (!!this.numberOfRecipes) {
            const recetasValues = attributes["Recetas"];

            //@ts-ignore
            attributes["Recetas"] = recetasValues.includes(this.numberOfRecipes)
                ? recetasValues
                : //@ts-ignore
                [...recetasValues, this.numberOfRecipes];
        }
        for (let attr of this.attributes) {
            const actualValues = attributes[attr.key];

            attributes[attr.key] = actualValues.includes(attr.value) ? actualValues : [...actualValues, attr.value];
        }

        return attributes;
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
     * Getter numberOfPersons
     * @return {number | undefined}
     */
    public get numberOfPersons(): number | undefined {
        return this._numberOfPersons;
    }

    /**
     * Getter numberOfRecipes
     * @return {number | undefined}
     */
    public get numberOfRecipes(): number | undefined {
        return this._numberOfRecipes;
    }

    /**
     * Setter numberOfPersons
     * @param {number | undefined} value
     */
    public set numberOfPersons(value: number | undefined) {
        this._numberOfPersons = value;
    }

    /**
     * Getter numberOfRecipes
     * @param {number | undefined} value
     */
    public set numberOfRecipes(value: number | undefined) {
        this._numberOfRecipes = value;
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
