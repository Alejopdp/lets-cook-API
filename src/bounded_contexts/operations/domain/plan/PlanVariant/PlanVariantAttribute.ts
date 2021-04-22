export class PlanVariantAttribute {
    private _key: string;
    private _value: string;

    constructor(key: string, value: string) {
        this._key = key;
        this._value = value;
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
