import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { PlanFrequency } from "./PlanFrequency";
import { PlanId } from "./PlanId";
import { PlanSku } from "./PlanSku";
import { PlanType } from "./PlanType/PlanType";
import { PlanVariant } from "./PlanVariant/PlanVariant";
import { Locale } from "../locale/Locale";
import { logger } from "../../../../../config";
import { PlanVariantId } from "./PlanVariant/PlanVariantId";
import { PlanSlug } from "./PlanSlug";
import _ from "lodash";

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
    private _locale: Locale;
    private _planSlug: PlanSlug;
    private _abilityToChooseRecipes: boolean;
    private _iconLinealUrl: string;
    private _iconLinealColorUrl: string;

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
        locale: Locale,
        planSlug: PlanSlug,
        abilityToChooseRecipes: boolean,
        iconLinealUrl: string,
        iconLinealColorUrl: string,
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
        this._locale = locale;
        this._planSlug = planSlug;
        this._abilityToChooseRecipes = abilityToChooseRecipes;
        this._iconLinealUrl = iconLinealUrl;
        this._iconLinealColorUrl = iconLinealColorUrl;
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
        locale: Locale,
        planSlug: PlanSlug,
        abilityToChooseRecipes: boolean,
        iconLinealUrl: string,
        iconLinealColorUrl: string,
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
        if (planVariants.every((variant) => !!!variant.isDefault)) throw new Error("Es necesario seleccionar una variante como default");
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
            locale,
            planSlug,
            abilityToChooseRecipes,
            iconLinealUrl,
            iconLinealColorUrl,
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

    public getPlanVariantById(planVariantId: PlanVariantId): PlanVariant | undefined {
        return this.planVariants.find((variant) => variant.id.equals(planVariantId));
    }

    public getPlanVariantPrice(planVariantId: PlanVariantId): number {
        const planVariant: PlanVariant | undefined = this.getPlanVariantById(planVariantId);
        if (!!!planVariant) throw new Error("La variante ingresada no existe");

        return planVariant.getPaymentPrice();
    }

    public getPlanVariantLabel(planVariantId: PlanVariantId): string {
        const planVariant: PlanVariant | undefined = this.getPlanVariantById(planVariantId);

        return !!!planVariant ? "" : planVariant.getLabel();
    }

    public getPlanVariantLabelWithPrice(planVariantId: PlanVariantId): string {
        const variantLabel = this.getPlanVariantLabel(planVariantId);

        if (!!!variantLabel) return "";

        return `${variantLabel} - ${this.getPlanVariantPrice(planVariantId)}`;
    }

    public isPrincipal(): boolean {
        return this.type === PlanType.Principal;
    }

    public getServingsQuantity(planVariantId: PlanVariantId): number {
        if (!!!this.hasRecipes) return 0;
        const planVariant = this.getPlanVariantById(planVariantId);
        if (!!!planVariant) return 0;

        return planVariant.getServingsQuantity();
    }

    public getAttirbutesAndValues(): [string, (string | number)[]][] {
        var attributes: { [key: string]: (string | number)[] } = {};
        const allAttributesKeyOfVariants = _.uniq(
            _.flatten(this.planVariants.map((variant) => variant.attributes.map((attr) => attr.key)))
        );

        for (let key of allAttributesKeyOfVariants) {
            attributes[key] = [];
        }

        if (this.isPrincipal()) {
            attributes["Personas"] = [];
            attributes["Recetas"] = [];

            for (let variant of this.planVariants) {
                const personasValues = attributes["Personas"];
                const recetasValues = attributes["Recetas"];

                //@ts-ignore
                attributes["Personas"] = personasValues.includes(variant.numberOfPersons)
                    ? personasValues
                    : //@ts-ignore
                      [...personasValues, variant.numberOfPersons];
                //@ts-ignore
                attributes["Recetas"] = recetasValues.includes(variant.numberOfRecipes)
                    ? recetasValues
                    : //@ts-ignore
                      [...recetasValues, variant.numberOfRecipes];
                for (let attr of variant.attributes) {
                    const actualValues = attributes[attr.key];

                    attributes[attr.key] = actualValues.includes(attr.value) ? actualValues : [...actualValues, attr.value];
                }
            }
        } else if (this.hasRecipes && !this.isPrincipal()) {
            attributes["Recetas"] = [];

            for (let variant of this.planVariants) {
                const recetasValues = attributes["Recetas"];
                //@ts-ignore
                attributes["Recetas"] = recetasValues.includes(variant.numberOfRecipes)
                    ? recetasValues
                    : //@ts-ignore
                      [...recetasValues, variant.numberOfRecipes];
                for (let attr of variant.attributes) {
                    const actualValues = attributes[attr.key];

                    attributes[attr.key] = actualValues.includes(attr.value) ? actualValues : [...actualValues, attr.value];
                }
            }
        } else {
            for (let variant of this.planVariants) {
                for (let attr of variant.attributes) {
                    const actualValues = attributes[attr.key];

                    attributes[attr.key] = actualValues.includes(attr.value) ? actualValues : [...actualValues, attr.value];
                }
            }
        }

        return Object.entries(attributes);
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
     * Getter locale
     * @return {Locale}
     */
    public get locale(): Locale {
        return this._locale;
    }

    /**
     * Getter planSlug
     * @return {PlanSlug}
     */
    public get planSlug(): PlanSlug {
        return this._planSlug;
    }

    /**
     * Getter abilityToChooseRecipes
     * @return {boolean}
     */
    public get abilityToChooseRecipes(): boolean {
        return this._abilityToChooseRecipes;
    }

    /**
     * Getter iconLinealUrl
     * @return {string}
     */
    public get iconLinealUrl(): string {
        return this._iconLinealUrl;
    }

    /**
     * Getter iconLinealColorUrl
     * @return {string}
     */
    public get iconLinealColorUrl(): string {
        return this._iconLinealColorUrl;
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

    /**
     * Setter locale
     * @param {Locale} value
     */
    public set locale(value: Locale) {
        this._locale = value;
    }

    /**
     * Setter planSlug
     * @param {PlanSlug} value
     */
    public set planSlug(value: PlanSlug) {
        this._planSlug = value;
    }

    /**
     * Setter abilityToChooseRecipes
     * @param {boolean} value
     */
    public set abilityToChooseRecipes(value: boolean) {
        this._abilityToChooseRecipes = value;
    }

    /**
     * Setter iconLinealUrl
     * @param {string} value
     */
    public set iconLinealUrl(value: string) {
        this._iconLinealUrl = value;
    }

    /**
     * Setter iconLinealColorUrl
     * @param {string} value
     */
    public set iconLinealColorUrl(value: string) {
        this._iconLinealColorUrl = value;
    }
}
