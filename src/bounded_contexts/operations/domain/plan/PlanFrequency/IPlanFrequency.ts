import { IValueObject } from "../../../../../core/domain/ValueObject";
import { Locale } from "../../locale/Locale";

export interface IPlanFrequency extends IValueObject<IPlanFrequency> {
    getLabel(locale: Locale): string;
    value(): string;
    isOneTime(): boolean;
    isWeekly(): boolean;
    isBiweekly(): boolean;
    isMonthly(): boolean;
}
