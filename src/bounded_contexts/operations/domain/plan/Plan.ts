import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { PlanFrequency } from "./PlanFrequency";
import { PlanId } from "./PlanId";
import { PlanSku } from "./PlanSku";
import { PlanType } from "./PlanType/PlanType";
import { PlanVariant } from "./PlanVariant/PlanVariant";

export class Plan extends Entity<Plan> {
    private _name: string;
    private _description: string;
    private _planSku: PlanSku;
    private _imageUrl: string;
    private _isActive: boolean;
    private _type: PlanType;
    private _planVariants: PlanVariant[];
    private _availablePlanFrecuencies: PlanFrequency[];

    protected constructor(
        name: string,
        description: string,
        planSku: PlanSku,
        imageUrl: string,
        isActive: boolean,
        type: PlanType,
        planVariants: PlanVariant[],
        availablePlanFrecuencies: PlanFrequency[],
        id?: PlanId
    ) {
        super(id);
        this._name = name;
        this._description = description;
        this._planSku = planSku;
        this._imageUrl = imageUrl;
        this._isActive = isActive;
        this._type = type;
        this._planVariants = planVariants;
        this._availablePlanFrecuencies = availablePlanFrecuencies;
    }

    public static create(
        name: string,
        description: string,
        planSku: PlanSku,
        imageUrl: string,
        isActive: boolean,
        type: PlanType,
        planVariants: PlanVariant[],
        availablePlanFrecuencies: PlanFrequency[],
        id?: PlanId
    ): Plan {
        const guardedProps = [
            { argument: name, argumentName: "Nombre completo" },
            { argument: description, argumentName: "Correo electrónico" },
        ];

        const guardResult = Guard.againstNullOrUndefinedOrEmptyBulk(guardedProps);

        if (!guardResult.succeeded) {
            throw new Error(guardResult.message);
        }

        if (planVariants.length < 1) throw new Error("No puede crear un plan sin ninguna variante");
        if (availablePlanFrecuencies.length < 1) throw new Error("Hay que ingresar al menos 1 frecuencia disponible para el plan");

        return new Plan(name, description, planSku, imageUrl, isActive, type, planVariants, availablePlanFrecuencies, id);
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Getter planSku
     * @return {PlanSku}
     */
    public get planSku(): PlanSku {
        return this._planSku;
    }

    /**
     * Getter imageUrl
     * @return {string}
     */
    public get imageUrl(): string {
        return this._imageUrl;
    }

    /**
     * Getter isActive
     * @return {boolean}
     */
    public get isActive(): boolean {
        return this._isActive;
    }

    /**
     * Getter type
     * @return {PlanType}
     */
    public get type(): PlanType {
        return this._type;
    }

    /**
     * Getter planVariants
     * @return {PlanVariant[]}
     */
    public get planVariants(): PlanVariant[] {
        return this._planVariants;
    }

    /**
     * Getter availablePlanFrecuencies
     * @return {PlanFrequency[]}
     */
    public get availablePlanFrecuencies(): PlanFrequency[] {
        return this._availablePlanFrecuencies;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter description
     * @param {string} value
     */
    public set description(value: string) {
        this._description = value;
    }

    /**
     * Setter planSku
     * @param {PlanSku} value
     */
    public set planSku(value: PlanSku) {
        this._planSku = value;
    }

    /**
     * Setter imageUrl
     * @param {string} value
     */
    public set imageUrl(value: string) {
        this._imageUrl = value;
    }

    /**
     * Setter isActive
     * @param {boolean} value
     */
    public set isActive(value: boolean) {
        this._isActive = value;
    }

    /**
     * Setter type
     * @param {PlanType} value
     */
    public set type(value: PlanType) {
        this._type = value;
    }

    /**
     * Setter planVariants
     * @param {PlanVariant[]} value
     */
    public set planVariants(value: PlanVariant[]) {
        this._planVariants = value;
    }

    /**
     * Setter availablePlanFrecuencies
     * @param {PlanFrequency[]} value
     */
    public set availablePlanFrecuencies(value: PlanFrequency[]) {
        this._availablePlanFrecuencies = value;
    }
}
