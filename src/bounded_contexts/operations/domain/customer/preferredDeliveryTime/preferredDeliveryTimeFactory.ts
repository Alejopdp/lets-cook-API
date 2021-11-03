import { From17To20 } from "./from17to20";
import { From19To22 } from "./from19to22";
import { From15To18 } from "./from15to18";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class PreferredDeliveryTimeFactory {
    public static createDeliveryTime(value: string): IPreferredDeliveryTime {
        switch (value) {
            case "15 - 18":
                return new From15To18();
            case "17 - 20":
                return new From17To20();
            case "19 - 22":
                return new From19To22();
            default:
                throw new Error("Invalid preferred delivery time value");
        }
    }
}
