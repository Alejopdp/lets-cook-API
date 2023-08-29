import { CustomerId } from "../../CustomerId";
import { WalletMovementLog } from "./WalletMovementLog";
import { WalletMovementLogType } from "./WalletMovementLogTypeEnum";

export class CreateWalletLog implements WalletMovementLog {
    private _type: string;
    private _title: string;
    private _description: string;
    private _customerId: CustomerId;

    constructor(customerId: CustomerId) {
        this._type = WalletMovementLogType.CREATE_WALLET;
        this._title = "";
        this._description = "";
        this._customerId = customerId;

    }
    getTitle(): string {
        throw new Error("Method not implemented.");
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