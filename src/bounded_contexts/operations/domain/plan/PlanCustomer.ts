import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { PlanFrequency } from "./PlanFrequency";
import { PlanId } from "./PlanId";
import { PlanSku } from "./PlanSku";
import { PlanType } from "./PlanType/PlanType";
import { PlanVariant } from "./PlanVariant/PlanVariant";
import { Locale } from "../locale/Locale";
import { logger } from "../../../../../config";

export class Plan extends Entity<Plan> {
    private _name: string;
    private _description: string;
    private _planSku: PlanSku;
    private _imageUrl: string;
    private _isActive: boolean;
    private _type: PlanType;
    private _planVariants: PlanVariant[];
    private _availablePlanFrecuencies: PlanFrequency[];
    private _hasRecipes: boolean;
    private _additionalPlans: Plan[];
    // private _locale: Locale;

    protected constructor(
        name: string,
        description: string,
        planSku: PlanSku,
        imageUrl: string,
        isActive: boolean,
        type: PlanType,
        planVariants: PlanVariant[],
        availablePlanFrecuencies: PlanFrequency[],
        hasRecipes: boolean,
        additionalPlans: Plan[],
        // locale: Locale,
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
        this._hasRecipes = hasRecipes;
        this._availablePlanFrecuencies = availablePlanFrecuencies;
        this._additionalPlans = additionalPlans;
        // this._locale = locale;
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
        hasRecipes: boolean,
        additionalPlans: Plan[],
        // locale: Locale,
        id?: PlanId
    ): Plan {
        const guardedProps = [
            { argument: name, argumentName: "Nombre" },
            { argument: description, argumentName: "Descripción" },
            { argument: type, argumentName: "Tipo de plan" },
        ];

        const guardResult = Guard.againstNullOrUndefinedOrEmptyBulk(guardedProps);

        if (!guardResult.succeeded) {
            throw new Error(guardResult.message);
        }

        if (planVariants.length < 1) throw new Error("No puede crear un plan sin ninguna variante");
        if (availablePlanFrecuencies.length < 1) throw new Error("Hay que ingresar al menos 1 frecuencia disponible para el plan");
        if (type === PlanType.Adicional && additionalPlans.length > 0)
            throw new Error("Un plan adicional no puede tener relacionado otros planes adidiconales");

        return new Plan(
            name,
            description,
            planSku,
            imageUrl,
            isActive,
            type,
            planVariants,
            availablePlanFrecuencies,
            hasRecipes,
            additionalPlans,
            // locale,
            id
        );
    }

    public toggleState(): void {
        // TO DO: Validate existing subscriptions with this plan?

        this.isActive = !this.isActive;
    }

    public canHaveAdditionalPlans(): boolean {
        return this.type === PlanType.Principal;
    }

    public updateAdditionalPlans(additionalPlans: Plan[]): void {
        if (!this.canHaveAdditionalPlans() && additionalPlans.length > 0)
            throw new Error("Un plan adicional no puede tener relacionado otros planes adidiconales");
        this.additionalPlans = additionalPlans;
    }

    public changeType(newType: PlanType): void {
        if (this.type === PlanType.Principal && newType === PlanType.Adicional && this.additionalPlans.length > 0) {
            throw new Error("Tiene que desasociar los planes adicionales antes de convertirlo en un plan adicional");
        } else {
            this.type = newType;
        }
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
     * Getter hasRecipes
     * @return {boolean}
     */
    public get hasRecipes(): boolean {
        return this._hasRecipes;
    }

    /**
     * Getter additionalPlans
     * @return {Plan[]}
     */
    public get additionalPlans(): Plan[] {
        return this._additionalPlans;
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
        if (value.length < 1) throw new Error("No puede crear un plan sin ninguna variante");

        this._planVariants = value;
    }

    /**
     * Setter availablePlanFrecuencies
     * @param {PlanFrequency[]} value
     */
    public set availablePlanFrecuencies(value: PlanFrequency[]) {
        this._availablePlanFrecuencies = value;
    }

    /**
     * Setter hasRecipes
     * @param {boolean} value
     */
    public set hasRecipes(value: boolean) {
        this._hasRecipes = value;
    }

    /**
     * Setter additionalPlans
     * @param {Plan[]} value
     */
    public set additionalPlans(value: Plan[]) {
        this._additionalPlans = value;
    }
}
