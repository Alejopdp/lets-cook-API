import { Coordinates } from "./Coordinates";

export class ShippingZoneRadio{
    private _coordinates: Coordinates[]

    constructor(coordinates: Coordinates[]) {
        this._coordinates = coordinates;
    }
    
    isInside(address: number): boolean {
        throw new Error("Method not implemented.");
    }

    /**
     * Getter coordinates
     * @return {Coordinates[]}
     */
     public get coordinates(): Coordinates[] {
        return this._coordinates;
    }

    /**
     * Setter coordinates
     * @param {Coordinates[]} value
     */
     public set coordinates(value: Coordinates[]) {
        this._coordinates = value;
    }
}