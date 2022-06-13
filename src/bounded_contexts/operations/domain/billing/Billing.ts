import { Entity } from "../../../../core/domain/Entity";
import { BillingId } from "./BillingId";

export class Billing extends Entity<Billing> {
    private _latitude: number;
    private _longitude: number;
    private _addressName: string;
    private _customerName: string;
    private _details: string;
    private _city: string;
    private _province: string;
    private _postalCode: string;
    private _country: string;
    private _identification?: string;

    constructor(
        latitude: number,
        longitude: number,
        addressName: string,
        customerName: string,
        details: string,
        city: string,
        province: string,
        postalCode: string,
        country: string,
        identification?: string,
        addressId?: BillingId) {
        super(addressId);
        this._latitude = latitude;
        this._longitude = longitude;
        this._addressName = addressName;
        this._customerName = customerName;
        this._details = details;
        this._identification = identification;
        this._city = city;
        this._province = province;
        this._postalCode = postalCode;
        this._country = country;

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
     * Getter city
     * @return {string}
     */
    public get city(): string {
        return this._city;
    }

    /**
     * Setter city
     * @param {string} value
     */
    public set city(value: string) {
        this._city = value;
    }


    /**
     * Getter province
     * @return {string}
     */
    public get province(): string {
        return this._province;
    }

    /**
     * Getter postalCode
     * @return {string}
     */
    public get postalCode(): string {
        return this._postalCode;
    }

    /**
     * Getter country
     * @return {string}
     */
    public get country(): string {
        return this._country;
    }

    /**
     * Setter province
     * @param {string} value
     */
    public set province(value: string) {
        this._province = value;
    }

    /**
     * Setter postalCode
     * @param {string} value
     */
    public set postalCode(value: string) {
        this._postalCode = value;
    }

    /**
     * Setter country
     * @param {string} value
     */
    public set country(value: string) {
        this._country = value;
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
