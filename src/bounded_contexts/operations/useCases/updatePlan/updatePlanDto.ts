import { ReadStream } from "fs";
import { Locale } from "../../domain/locale/Locale";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { PlanFrequencyType } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";

export interface UpdatePlanDto {
    id: string | number;
    planName: string;
    planDescription: string;
    planSku: string;
    planImage?: ReadStream;
    planImageFileName: string;
    planType: PlanType;
    planVariants: Array<any>;
    isActive: boolean;
    availablePlanFrecuencies: PlanFrequencyType[];
    hasRecipes: boolean;
    additionalPlansIds: string[] | number[];
    planSlug: string;
    abilityToChooseRecipes: boolean;
    iconLinealFile?: ReadStream;
    iconLinealFileName: string;
    iconLinealColorFile?: ReadStream;
    iconLinealColorFileName: string;
    locale: Locale;
}
