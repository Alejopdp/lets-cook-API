import { ReadStream } from "fs";
import { Locale } from "../../domain/locale/Locale";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";

export interface UpdateCuponStateDto {
    id: string | number;
    state: string;
}
