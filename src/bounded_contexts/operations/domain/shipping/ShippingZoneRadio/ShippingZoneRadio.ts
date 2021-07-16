import { Coordinates } from "./Coordinates";
import pointInPolygon from "point-in-polygon";

export class ShippingZoneRadio {
    private _coordinates: Coordinates[];

    constructor(coordinates: Coordinates[]) {
        this._coordinates = coordinates;
    }

    public hasPointInside(lat: number, lng: number): boolean {
        return pointInPolygon([lat, lng], this.getArrayOfCoordinatesTuple());
    }

    public getArrayOfCoordinatesTuple(): number[][] {
        const array = [];

        for (let coordinate of this.coordinates) {
            array.push([coordinate.latitude, coordinate.longitude]);
        }

        return array;
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
