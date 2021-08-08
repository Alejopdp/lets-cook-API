import { BiweeklyFrequency } from "./BiweeklyFrequency";
import { IPlanFrequency } from "./IPlanFrequency";
import { MonthlyFrequency } from "./MonthlyFrequency";
import { OneTimeFrequency } from "./OneTimeFrequency";
import { WeeklyFrequency } from "./WeeklyFrequency";

export class PlanFrequencyFactory {
    public static createPlanFrequency(value: string): IPlanFrequency {
        switch (value) {
            case "one_time":
                return new OneTimeFrequency();
            case "weekly":
                return new WeeklyFrequency();
            case "biweekly":
                return new BiweeklyFrequency();
            case "monthly":
                return new MonthlyFrequency();
            default:
                throw new Error("No existe la frecuencia ingresada");
        }
    }
}
