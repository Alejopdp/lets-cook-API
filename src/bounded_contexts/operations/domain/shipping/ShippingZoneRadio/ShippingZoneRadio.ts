import { Coordinates } from "./Coordinates";
import pointInPolygon from "point-in-polygon";

export class ShippingZoneRadio {
    private _coordinates: Coordinates[];

    constructor(coordinates: Coordinates[]) {
        this._coordinates = coordinates;
    }

    public isInside(address: number): boolean {
        throw new Error("Method not implemented.");
    }

    public hasPointInside(lat: number, lng: number): boolean {
        console.log("LAT: ", lat);
        console.log("LNG: ", lng);
        console.log("POLYIGON: ", this.getArrayOfCoordinatesTuple());
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
