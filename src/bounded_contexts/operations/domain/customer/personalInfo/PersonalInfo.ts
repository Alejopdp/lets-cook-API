import { Entity } from "../../../../../core/domain/Entity";
import { PersonalInfoId } from "./PersonalInfoId";

export class PersonalInfo extends Entity<PersonalInfoId> {
    private _name: string;
    private _lastName: string;
    private _phone1?: string;
    private _phone2?: string;
    private _birthDate?: Date;
    private _preferredLanguage?: string;

    constructor(
        name: string,
        lastName: string,
        phone1: string,
        phone2?: string,
        brithDate?: Date,
        preferredLanguage?: string,
        id?: PersonalInfoId
    ) {
        super(id);
        this._name = name;
        this._lastName = lastName;
        this._phone1 = phone1;
        this._phone2 = phone2;
        this._birthDate = brithDate;
        this._preferredLanguage = preferredLanguage;
    }

    public changeInfo(name: string, last_name: string, phone1: string, phone2: string, birthDate: Date, preferredLanguage: string): void {
        this.name = name;
        this.lastName = last_name;
        this.phone1 = phone1;
        this.phone2 = phone2;
        this.birthDate = birthDate;
        this.preferredLanguage = preferredLanguage;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter lastName
     * @return {string}
     */
    public get lastName(): string {
        return this._lastName;
    }

    /**
     * Getter phone1
     * @return {string}
     */
    public get phone1(): string | undefined {
        return this._phone1;
    }

    /**
     * Getter phone2
     * @return {string}
     */
    public get phone2(): string | undefined {
        return this._phone2;
    }

    /**
     * Getter birthDate
     * @return {Date}
     */
    public get birthDate(): Date | undefined {
        return this._birthDate;
    }

    /**
     * Getter preferredLanguage
     * @return {string}
     */
    public get preferredLanguage(): string | undefined {
        return this._preferredLanguage;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter lastName
     * @param {string} value
     */
    public set lastName(value: string) {
        this._lastName = value;
    }

    /**
     * Setter phone1
     * @param {string} value
     */
    public set phone1(value: string | undefined) {
        this._phone1 = value;
    }

    /**
     * Setter phone2
     * @param {number} value
     */
    public set phone2(value: string | undefined) {
        this._phone2 = value;
    }

    /**
     * Setter birthDate
     * @param {Date} value
     */
    public set birthDate(value: Date | undefined) {
        this._birthDate = value;
    }

    /**
     * Setter preferredLanguage
     * @param {string} value
     */
    public set preferredLanguage(value: string | undefined) {
        this._preferredLanguage = value;
    }
}
