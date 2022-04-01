import { IValueObject } from "../../../../../core/domain/ValueObject";
import { Locale } from "../../locale/Locale";

export interface IPlanFrequency extends IValueObject<IPlanFrequency> {
    getLabel(locale?: Locale): string;
    getNumberOfDays(): number;
    value(): string;
    isOneTime(): boolean;
    isWeekly(): boolean;
    isBiweekly(): boolean;
    isMonthly(): boolean;
    getNDatesWithFrequencyOffset(qtyOfDates: number, baseDate: Date): Date[];
}
