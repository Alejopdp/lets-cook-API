import { IValueObject } from "../../../../../core/domain/ValueObject";

export class NutritionalItem implements IValueObject<NutritionalItem> {
    private _key: string;
    private _value: string;
    private _id: string;

    constructor(key: string, value: string, id?: string) {
        this._key = key;
        this._value = value;
        this._id = id ?? "";
    }

    public equals(aNutritionalItem: NutritionalItem): boolean {
        return this.key === aNutritionalItem.key && this.value === aNutritionalItem.value;
    }

    /**
     * Getter key
     * @return {string}
     */
    public get key(): string {
        return this._key;
    }

    /**
     * Getter value
     * @return {string}
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Setter key
     * @param {string} value
     */
    public set key(value: string) {
        this._key = value;
    }

    /**
     * Setter value
     * @param {string} value
     */
    public set value(value: string) {
        this._value = value;
    }
}
