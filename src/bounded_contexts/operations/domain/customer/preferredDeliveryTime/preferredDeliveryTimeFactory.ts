import { From12To16 } from "./from12to16";
import { From16To20 } from "./from16to20";
import { From8To12 } from "./from8to12";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class PreferredDeliveryTimeFactory {
    public static createDeliveryTime(value: string): IPreferredDeliveryTime {
        switch (value) {
            case "8 - 12":
                return new From8To12();
            case "12 - 16":
                return new From12To16();
            case "16 - 20":
                return new From16To20();
            default:
                throw new Error("Invalid preferred delivery time value");
        }
    }
}
