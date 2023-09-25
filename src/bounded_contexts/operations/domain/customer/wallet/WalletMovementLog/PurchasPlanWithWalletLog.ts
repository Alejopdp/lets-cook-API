import { Locale } from "../../../locale/Locale";
import { CustomerId } from "../../CustomerId";
import { WalletMovementLog } from "./WalletMovementLog";
import { WalletMovementLogType } from "./WalletMovementLogTypeEnum";

export class PurchasePlanWithWalletLog implements WalletMovementLog {
    private _type: string;
    private _title: string;
    private _description: string;
    private _customerId: CustomerId;
    private _createdAt: Date;
    private _amount: number;

    constructor(customerId: CustomerId, createDate: Date, amount: number) {
        this._type = WalletMovementLogType.PURCHASE_PLAN_WITH_WALLET;
        this._title = "";
        this._description = "";
        this._customerId = customerId;
        this._createdAt = createDate;
        this._amount = -Math.abs(amount);
    }

    public getTitle(locale: Locale): string {
        switch (locale) {
            case Locale.en:
                return "Plan purchased with wallet manually";
            case Locale.ca:
                return "Se ha comprado un plan con monedero manualmente";
            case Locale.es:
                return "Se ha comprado un plan con monedero manualmente";
            default:
                return "Se ha comprado un plan con monedero manualmente"
        }
    }

    /**
     * Getter type
     * @return {string}
     */
    public get type(): string {
        return this._type;
    }

    /**
     * Getter title
     * @return {string}
     */
    public get title(): string {
        return this._title;
    }

    /**
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }


    /**
     * Getter customerId
     * @return {CustomerId}
     */
    public get customerId(): CustomerId {
        return this._customerId;
    }


    /**
     * Getter createdAt
     * @return {Date}
     */
    public get createdAt(): Date {
        return this._createdAt;
    }


    /**
     * Getter amount
     * @return {number}
     */
    public get amount(): number {
        return this._amount;
    }

    /**
     * Setter amount
     * @param {number} value
     */
    public set amount(value: number) {
        this._amount = value;
    }


    /**
     * Setter createdAt
     * @param {Date} value
     */
    public set createdAt(value: Date) {
        this._createdAt = value;
    }


    /**
     * Setter customerId
     * @param {CustomerId} value
     */
    public set customerId(value: CustomerId) {
        this._customerId = value;
    }


    /**
     * Setter type
     * @param {string} value
     */
    public set type(value: string) {
        this._type = value;
    }

    /**
     * Setter title
     * @param {string} value
     */
    public set title(value: string) {
        this._title = value;
    }

    /**
     * Setter description
     * @param {string} value
     */
    public set description(value: string) {
        this._description = value;
    }

}