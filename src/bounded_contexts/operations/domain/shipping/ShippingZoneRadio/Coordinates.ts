// import { ILimitAplication } from "./ILimitAplication";

export class Coordinates{
    private latitude: number;
    private longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // /**
    //  * Getter name
    //  * @return {number}
    //  */
    //  public get latitude(): number {
    //     return this.latitude;
    // }

    // /**
    //  * Getter reference
    //  * @return {number}
    //  */
    //  public get longitude(): number {
    //     return this.longitude;
    // }

    // /**
    //  * Setter name
    //  * @param {string} value
    //  */
    //  public set latitude(value: number) {
    //     this.latitude = value;
    // }

    // /**
    //  * Setter reference
    //  * @param {String} value
    //  */
    //  public set longitude(value: number) {
    //     this.longitude = value;
    // }
    
    isValid(appliedQty: number): boolean {
        throw new Error("Method not implemented.");
    }
}