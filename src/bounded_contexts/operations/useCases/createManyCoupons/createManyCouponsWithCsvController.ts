import { BaseController } from "../../../../core/infra/BaseController";
import { CouponToCreate, CreateManyCouponsDto } from "./createManyCouponsDto";
import fs from "fs";
import { CreateManyCoupons } from "./createManyCoupons";
import { IExportService } from "../../application/exportService/IExportService";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { LimitApplicationFactory } from "../../domain/cupons/LimitAplication/LimitApplicationFactory";
import { CreateManyCouponsPresenter } from "./createManyCouponsWithCsvPresenter";
import { CouponApplicationType } from "../../domain/cupons/CouponApplicationType";
import { MaxChargeQtyType } from "../../domain/cupons/CouponMaxChargeQtyType";
import { CouponRequirementType } from "../../domain/cupons/CouponRequirementType";

export class CreateManyCouponsWithCsvController extends BaseController {
    private _createCoupon: CreateManyCoupons;
    private _xlsxService: IExportService;
    private _createManyCouponsPresenter: CreateManyCouponsPresenter;

    constructor(createCoupon: CreateManyCoupons, xlsxService: IExportService, createManyCouponsPresenter: CreateManyCouponsPresenter) {
        super();
        this._createCoupon = createCoupon;
        this._xlsxService = xlsxService;
        this._createManyCouponsPresenter = createManyCouponsPresenter;
    }

    protected async executeImpl(): Promise<any> {
        const filePath = this.req.file?.path;
        if (!!!filePath) throw new Error("No ha ingresado ningún archivo para importar");

        try {
            const matrix = this.xlsxService.parseCsvToJson(filePath);
            var couponsToCreate: CouponToCreate[] = [];
            const couponToCreateProductsMap: { [couponCode: string]: string[] } = {}; // {couponCode: [sku1, sku2, sku3]}

            for (let i = 0; i < matrix.length; i++) {
                if (i === 0) continue;

                const appliesToSpecificProducts = matrix[i][6] === "specific";
                const limits: ILimitAplication[] = [];
                matrix[i][0] ? limits.push(LimitApplicationFactory.create(matrix[i][0], parseInt(matrix[i][1]))) : "";
                matrix[i][2] ? limits.push(LimitApplicationFactory.create(matrix[i][2], parseInt(matrix[i][3]))) : "";
                matrix[i][4] ? limits.push(LimitApplicationFactory.create(matrix[i][4], parseInt(matrix[i][5]))) : "";

                if (appliesToSpecificProducts && couponsToCreate.some((coupon) => coupon.couponCode === matrix[i][8])) {
                    couponToCreateProductsMap[matrix[i][8]] = Array.isArray(couponToCreateProductsMap[matrix[i][8]])
                        ? [...couponToCreateProductsMap[matrix[i][8]], matrix[i][7]]
                        : [matrix[i][7]];

                    couponsToCreate = couponsToCreate.map((coupon) => ({
                        ...coupon,
                        productsForApplyingValue:
                            coupon.couponCode === matrix[i][8] ? couponToCreateProductsMap[matrix[i][8]] : coupon.productsForApplyingValue,
                    }));
                } else {
                    couponsToCreate.push({
                        limites: limits,
                        productsForApplyingType: matrix[i][6] as CouponApplicationType,
                        productsForApplyingValue: appliesToSpecificProducts ? [matrix[i][7]] : [],
                        couponCode: matrix[i][8],
                        maxChargeQtyType: matrix[i][9] as MaxChargeQtyType,
                        maxChargeQtyValue: parseInt(matrix[i][10]),
                        startDate: new Date(
                            parseInt(matrix[i][11].split("/")[2]),
                            parseInt(matrix[i][11].split("/")[1]) - 1,
                            parseInt(matrix[i][11].split("/")[0])
                        ),
                        endDate: !!matrix[i][12]
                            ? new Date(
                                parseInt(matrix[i][12].split("/")[2]),
                                parseInt(matrix[i][12].split("/")[1]) - 1,
                                parseInt(matrix[i][12].split("/")[0])
                            )
                            : undefined,
                        discountType: matrix[i][13],
                        discountValue: parseInt(matrix[i][14]),
                        minRequireType: matrix[i][15] as CouponRequirementType,
                        minRequireValue: parseInt(matrix[i][16]),
                        state: matrix[i][17],
                    });
                }
            }
            const dto: CreateManyCouponsDto = {
                couponsToCreate,
            };
            const coupons = await this.createCoupon.execute(dto);

            fs.unlinkSync(filePath);

            return this.ok(this.res, this.createManyCouponsPresenter.present(coupons));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter createPlan
     * @return {CreateManyCoupons}
     */
    public get createCoupon(): CreateManyCoupons {
        return this._createCoupon;
    }

    /**
     * Getter xlsxService
     * @return {IExportService}
     */
    public get xlsxService(): IExportService {
        return this._xlsxService;
    }

    /**
     * Getter createManyCouponsPresenter
     * @return {CreateManyCouponsPresenter}
     */
    public get createManyCouponsPresenter(): CreateManyCouponsPresenter {
        return this._createManyCouponsPresenter;
    }
}
