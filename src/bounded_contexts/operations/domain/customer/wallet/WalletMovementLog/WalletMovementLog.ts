import { Locale } from "../../../locale/Locale";
import { CustomerId } from "../../CustomerId";

export abstract class WalletMovementLog {
    public abstract type: string;
    public abstract title: string;
    public abstract description: string;
    public abstract customerId: CustomerId;
    public abstract createdAt: Date;
    public abstract amount: number;
    public abstract getTitle: (locale: Locale) => string;
}