import { BaseController } from "../../../../core/infra/BaseController";
import { CreateCouponCSVDto } from "./createCouponDto";
import fs from "fs";
import { CreateCoupon } from "./createCouponCSV";
import { Locale } from "../../domain/locale/Locale";
var XLSX = require("xlsx");

function renameKeys(obj: any, newKeys: any) {
    const keyValues = Object.keys(obj).map((key) => {
        const newKey = newKeys[key] || key;
        let objAux = {
            [newKey]: obj[key] === "null" || obj[key] === "undefined" ? null : obj[key],
        };
        return objAux;
    });
    let objFinal = Object.assign({}, ...keyValues);
    return objFinal;
}

export class CreateCouponControllerCSV extends BaseController {
    private _createCoupon: CreateCoupon;

    constructor(createCoupon: CreateCoupon) {
        super();
        this._createCoupon = createCoupon;
    }

    protected async executeImpl(): Promise<any> {
        try {
            if (!this.req.file) throw new Error("No ha ingresado ningún archivo para importar cupones");
            const csvCouponsPath = this.req.file.path;
            var workbook = XLSX.readFile(csvCouponsPath);
            var third_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            var coupons_list = XLSX.utils.sheet_to_json(third_worksheet, { header: 1 });
            const keysMapCoupons = {
                "0": "name",
                "1": "discount_type",
                "2": "discount_value",
                "3": "minimum_requirement_type",
                "4": "minimum_requirement_value",
                "5": "apply_to_type",
                "6": "appy_to_value",
                "7": "application_limit_type_1",
                "8": "application_limit_value_1",
                "9": "application_limit_type_2",
                "10": "application_limit_value_2",
                "11": "application_limit_type_3",
                "12": "application_limit_value_3",
                "13": "coupons_by_suscription_type",
                "14": "coupons_by_suscription_value",
                "15": "date_range_start",
                "16": "date_range_expire",
                "17": "state",
            };

            var arrayNewCoupons = coupons_list.map((val: any) => {
                return { ...val };
            });

            const arrayNewObjectsCoupons = arrayNewCoupons.map((val: any) => renameKeys(val, keysMapCoupons));
            arrayNewObjectsCoupons.shift();

            for (let i = 0; i < arrayNewObjectsCoupons.length; i++) {
                let keyList = Object.keys(arrayNewObjectsCoupons[i]);
                keyList.map((val: any, j: number) => {
                    if (val.includes("application_limit_type")) {
                        if (arrayNewObjectsCoupons[i][val] === null) {
                            delete arrayNewObjectsCoupons[i][val];
                            delete arrayNewObjectsCoupons[i][keyList[j + 1]];
                        }
                    }
                });
                for (let key in arrayNewObjectsCoupons[i]) {
                    if (key === "appy_to_value") {
                        let arrayIdApplyValue = arrayNewObjectsCoupons[i][key];
                        let newArrayApplyValue = arrayIdApplyValue.split(",");
                        arrayNewObjectsCoupons[i][key] = newArrayApplyValue;
                    }
                }
            }

            for (let i = 0; i < arrayNewObjectsCoupons.length; i++) {
                let obj: any = {},
                    listLimits: any = [];
                let keyList = Object.keys(arrayNewObjectsCoupons[i]);
                keyList.map((val: any, j: number) => {
                    if (val.includes("application_limit_type")) {
                        obj.type = arrayNewObjectsCoupons[i][val];
                        obj.value = arrayNewObjectsCoupons[i][keyList[j + 1]];
                        listLimits = [...listLimits, obj];
                        obj = {};
                    }
                });
                arrayNewObjectsCoupons[i]["application_limit"] = listLimits;
            }

            for (let index = 0; index < arrayNewObjectsCoupons.length; index++) {
                const dto: CreateCouponCSVDto = {
                    couponCode: arrayNewObjectsCoupons[index].name,
                    discountType: arrayNewObjectsCoupons[index].discount_type,
                    discountValue: arrayNewObjectsCoupons[index].discount_value,
                    minRequireType: arrayNewObjectsCoupons[index].minimum_requirement_type,
                    minRequireValue: arrayNewObjectsCoupons[index].minimum_requirement_value,
                    productsForApplyingType: arrayNewObjectsCoupons[index].apply_to_type,
                    productsForApplyingValue: arrayNewObjectsCoupons[index].appy_to_value,
                    limites: arrayNewObjectsCoupons[index].application_limit,
                    maxChargeQtyType: arrayNewObjectsCoupons[index].coupons_by_suscription_type,
                    maxChargeQtyValue: arrayNewObjectsCoupons[index].coupons_by_suscription_value,
                    startDate: arrayNewObjectsCoupons[index].date_range_start,
                    endDate: arrayNewObjectsCoupons[index].date_range_expire,
                    state: arrayNewObjectsCoupons[index].state,
                };

                await this.createCoupon.execute(dto);
            }

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter createPlan
     * @return {CreateCoupon}
     */
    public get createCoupon(): CreateCoupon {
        return this._createCoupon;
    }
}
