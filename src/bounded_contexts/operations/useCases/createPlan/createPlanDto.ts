import { ReadStream } from "fs";
import { Locale } from "../../domain/locale/Locale";
import { PlanType } from "../../domain/plan/PlanType/PlanType";

export interface CreatePlanDto {
    planName: string;
    planDescription: string;
    planSku: string;
    planImage: ReadStream;
    planImageFileName: string;
    planType: PlanType;
    planVariants: Array<any>;
    isActive: boolean;
    availablePlanFrecuencies: string[];
    hasRecipes: boolean;
    additionalPlansIds: string[] | number[];
    planSlug: string;
    abilityToChooseRecipes: boolean;
    iconLinealFile: ReadStream;
    iconLinealFileName: string;
    iconLinealColorFile: ReadStream;
    iconLinealColorFileName: string;
    locale: Locale;
}
