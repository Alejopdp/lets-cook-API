import { FirstOrder } from "../LimitAplication/FirstOrder";
import { ILimitAplication } from "../LimitAplication/ILimitAplication";
import { LimitQty } from "../LimitAplication/LimitQty";
import { OnePerCustomer } from "../LimitAplication/OnePerCustomer";

export class LimitApplicationFactory {
    public static create(type: string, value: number): ILimitAplication {
        switch (type) {
            case "limit_one_customer":
                return new OnePerCustomer(type, value);

            case "first_order":
                return new FirstOrder(type, value);

            case "limit_qty":
                return new LimitQty(type, value);

            default:
                throw new Error(
                    "No ingresó ninguno de los tipos de limite válidos para un cupón (limit_one_customer | first_order | limit_qty)"
                );
        }
    }
}
