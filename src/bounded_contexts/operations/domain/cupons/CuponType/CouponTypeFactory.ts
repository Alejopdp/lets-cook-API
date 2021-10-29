import { FixedPrice } from "./FixedPrice";
import { FreeShipping } from "./FreeShipping";
import { ICouponType } from "./ICuponType";
import { PercentPrice } from "./PercentagePrice";

export class CouponTypeFactory {
    public static create(type: string, value: number): ICouponType {
        switch (type) {
            case "fixed":
                return new FixedPrice(type, value);

            case "percent":
                return new PercentPrice(type, value);

            case "free":
                return new FreeShipping(type, value);
            default:
                throw new Error("No ingresó ninguno de los tipos de descuento válidos para un cupón (fixed | percent | free)");
        }
    }
}
