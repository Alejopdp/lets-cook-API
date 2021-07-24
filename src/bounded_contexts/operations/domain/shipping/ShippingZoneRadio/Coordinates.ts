// import { ILimitAplication } from "./ILimitAplication";

export class Coordinates {
    private _latitude: number;
    private _longitude: number;

    constructor(latitude: number, longitude: number) {
        this._latitude = latitude;
        this._longitude = longitude;
    }

    /**
     * Getter latitude
     * @return {number}
     */
    public get latitude(): number {
        return this._latitude;
    }

    /**
     * Getter longitude
     * @return {number}
     */
    public get longitude(): number {
        return this._longitude;
    }

    /**
     * Setter latitude
     * @param {number} value
     */
    public set latitude(value: number) {
        this._latitude = value;
    }

    /**
     * Setter longitude
     * @param {number} value
     */
    public set longitude(value: number) {
        this._longitude = value;
    }
}
