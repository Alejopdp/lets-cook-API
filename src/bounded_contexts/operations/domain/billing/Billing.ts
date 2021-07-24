import { Entity } from "../../../../core/domain/Entity";
import { BillingId } from "./BillingId";

export class Billing extends Entity<Billing> {
    private _latitude: number;
    private _longitude: number;
    private _addressName: string;
    private _customerName: string;
    private _details: string;
    private _identification?: string;

    constructor(
        latitude: number, 
        longitude: number, 
        addressName: string, 
        customerName: string, 
        details: string, 
        identification?: string,
        addressId?: BillingId ) {
        super(addressId);
        this._latitude = latitude;
        this._longitude = longitude;
        this._addressName = addressName;
        this._customerName = customerName;
        this._details = details;
        this._identification = identification;
    }

    public changeInfoBilling(lat: number, long: number, addresName: string, customerName: string, details: string, identification: string): void {
        this.latitude = lat;
        this.longitude = long;
        this.addressName = addresName;
        this.customerName = customerName;
        this.details = details;
        this.identification = identification;
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
    public get addressName(): string {
        return this._addressName;
    }

    /**
     * Getter fullName
     * @return {string}
     */
    public get customerName(): string {
        return this._customerName;
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
    public set addressName(value: string) {
        this._addressName = value;
    }

    /**
     * Setter fullName
     * @param {string} value
     */
    public set customerName(value: string) {
        this._customerName = value;
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
}
