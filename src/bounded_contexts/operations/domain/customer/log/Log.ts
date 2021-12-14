import { CustomerId } from "../CustomerId";
import { LogType } from "./LogType";

export class Log {
    private _type: LogType;
    private _user: string;
    private _role: string;
    private _action: string;
    private _debugAction: string;
    private _timestamp: Date;
    private _customerId: CustomerId;

    constructor(type: LogType, user: string, role: string, action: string, debugAction: string, timestamp: Date, customerId: CustomerId) {
        this._type = type;
        this._user = user;
        this._role = role;
        this._action = action;
        this._debugAction = debugAction;
        this._timestamp = timestamp;
        this._customerId = customerId;
    }

    /**
     * Getter type
     * @return {LogType}
     */
    public get type(): LogType {
        return this._type;
    }

    /**
     * Getter user
     * @return {string}
     */
    public get user(): string {
        return this._user;
    }

    /**
     * Getter role
     * @return {string}
     */
    public get role(): string {
        return this._role;
    }

    /**
     * Getter action
     * @return {string}
     */
    public get action(): string {
        return this._action;
    }

    /**
     * Getter debugAction
     * @return {string}
     */
    public get debugAction(): string {
        return this._debugAction;
    }

    /**
     * Getter timestamp
     * @return {Date}
     */
    public get timestamp(): Date {
        return this._timestamp;
    }

    /**
     * Getter customerId
     * @return {CustomerId}
     */
    public get customerId(): CustomerId {
        return this._customerId;
    }

    /**
     * Setter type
     * @param {LogType} value
     */
    public set type(value: LogType) {
        this._type = value;
    }

    /**
     * Setter user
     * @param {string} value
     */
    public set user(value: string) {
        this._user = value;
    }

    /**
     * Setter role
     * @param {string} value
     */
    public set role(value: string) {
        this._role = value;
    }

    /**
     * Setter action
     * @param {string} value
     */
    public set action(value: string) {
        this._action = value;
    }

    /**
     * Setter debugAction
     * @param {string} value
     */
    public set debugAction(value: string) {
        this._debugAction = value;
    }

    /**
     * Setter timestamp
     * @param {Date} value
     */
    public set timestamp(value: Date) {
        this._timestamp = value;
    }

    /**
     * Setter customerId
     * @param {CustomerId} value
     */
    public set customerId(value: CustomerId) {
        this._customerId = value;
    }
}
