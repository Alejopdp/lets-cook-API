import { Entity } from "../../../../core/domain/Entity";
import { AddressId } from "./AddressId";

export class Address extends Entity<Address> {
    private _latitude: number;
    private _longitude: number;
    private _name: string;
    private _fullName: string;
    private _details: string;
    private _identification?: string;
    private _deliveryTime?: string;

    constructor(
        latitude: number, 
        longitude: number, 
        name: string, 
        fullName: string, 
        details: string, 
        identification?: string,
        deliveryTime?: string,
        addressId?: AddressId ) {
        super(addressId);
        this._latitude = latitude;
        this._longitude = longitude;
        this._name = name;
        this._fullName = fullName;
        this._details = details;
        this._identification = identification;
        this._deliveryTime = deliveryTime;
    }

    public nameWithDetails(): string {
        return this.name + " " + this.details;
    }

    public fullNameWithDetails(): string {
        return this.fullName + " " + this.details;
    }

    public changeInfoBilling(lat: number, long: number, name: string, fullName: string, details: string, identification: string): void {
        this.latitude = lat;
        this.longitude = long;
        this.name = name;
        this.fullName = fullName;
        this.details = details;
        this.identification = identification;
    }

    public changeInfoShipping(lat: number, long: number, name: string, fullName: string, details: string, deliveryTime: string): void {
        this.latitude = lat;
        this.longitude = long;
        this.name = name;
        this.fullName = fullName;
        this.details = details;
        this.deliveryTime = deliveryTime;
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
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter fullName
     * @return {string}
     */
    public get fullName(): string {
        return this._fullName;
    }

    /**
     * Getter details
     * @return {string}
     */
    public get details(): string {
        return this._details;
    }

    /**
     * Getter identification
     * @return {string}
     */
     public get identification(): string | undefined {
        return this._identification;
    }

    /**
     * Getter deliveryTime
     * @return {string}
     */
     public get detliveryTime(): string | undefined {
        return this._deliveryTime;
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

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter fullName
     * @param {string} value
     */
    public set fullName(value: string) {
        this._fullName = value;
    }

    /**
     * Setter details
     * @param {string} value
     */
    public set details(value: string) {
        this._details = value;
    }

    /**
     * Setter identification
     * @param {string} value
     */
     public set identification(value: string | undefined) {
        this._identification = value;
    }

    /**
     * Setter deliveryTime
     * @param {string} value
     */
     public set deliveryTime(value: string | undefined) {
        this._deliveryTime = value;
    }
}
