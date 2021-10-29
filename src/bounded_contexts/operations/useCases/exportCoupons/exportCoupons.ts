import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { Coupon } from "../../domain/cupons/Cupon";
import { CouponExport, IExportService } from "../../application/exportService/IExportService";
import { ExportCouponsDto } from "./exportCouponsDto";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { Plan } from "../../domain/plan/Plan";
import { Locale } from "../../domain/locale/Locale";

export class ExportCoupons {
    private _couponRepository: ICouponRepository;
    private _exportService: IExportService;
    private _planRepository: IPlanRepository;

    constructor(couponRepository: ICouponRepository, exportService: IExportService, planRepository: IPlanRepository) {
        this._couponRepository = couponRepository;
        this._exportService = exportService;
        this._planRepository = planRepository;
    }

    public async execute(dto: ExportCouponsDto): Promise<any> {
        const coupons: Coupon[] = await this.couponRepository.findAll();
        const plans: Plan[] = await this.planRepository.findAll(Locale.es);
        const planMap: { [planId: string]: Plan } = {};
        const couponsRows: CouponExport[] = [];

        for (let plan of plans) {
            planMap[plan.id.value] = plan;
        }

        for (let coupon of coupons) {
            if (coupon.appliesToSpecificProducts()) {
                for (let i = 0; i < coupon.productsForApplyingValue.length; i++) {
                    couponsRows.push({
                        application_limit_type_1: coupon.limites[0]?.type || "",
                        application_limit_value_1: coupon.limites[0]?.value || 0,
                        application_limit_type_2: coupon.limites[1]?.type || "",
                        application_limit_value_2: coupon.limites[1]?.value || 0,
                        application_limit_type_3: coupon.limites[2]?.type || "",
                        application_limit_value_3: coupon.limites[2]?.value || 0,
                        apply_to_type: coupon.productsForApplyingType,
                        apply_to_value: planMap[coupon.productsForApplyingValue[i].value].planSku.code,
                        couponCode: coupon.couponCode,
                        coupon_id: coupon.id.value as string,
                        coupons_by_subscriptions_type: coupon.maxChargeQtyType,
                        coupons_by_suscription_value: coupon.maxChargeQtyValue,
                        date_range_expire: coupon.endDate || "",
                        date_range_start: coupon.startDate || "",
                        discount_type: coupon.type.type,
                        discount_value: coupon.type.value,
                        minimum_requirement_type: coupon.minRequireType,
                        minimum_requirement_value: coupon.minRequireValue,
                        state: coupon.state,
                    });
                }
            } else {
                couponsRows.push({
                    application_limit_type_1: coupon.limites[0]?.type || "",
                    application_limit_value_1: coupon.limites[0]?.value || 0,
                    application_limit_type_2: coupon.limites[1]?.type || "",
                    application_limit_value_2: coupon.limites[1]?.value || 0,
                    application_limit_type_3: coupon.limites[2]?.type || "",
                    application_limit_value_3: coupon.limites[2]?.value || 0,
                    apply_to_type: coupon.productsForApplyingType,
                    apply_to_value: JSON.stringify(coupon.productsForApplyingValue),
                    couponCode: coupon.couponCode,
                    coupon_id: coupon.id.value as string,
                    coupons_by_subscriptions_type: coupon.maxChargeQtyType,
                    coupons_by_suscription_value: coupon.maxChargeQtyValue,
                    date_range_expire: coupon.endDate || "",
                    date_range_start: coupon.startDate || "",
                    discount_type: coupon.type.type,
                    discount_value: coupon.type.value,
                    minimum_requirement_type: coupon.minRequireType,
                    minimum_requirement_value: coupon.minRequireValue,
                    state: coupon.state,
                });
            }
        }
        this.exportService.exportCoupons(couponsRows);

        return;
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter exportService
     * @return {IExportService}
     */
    public get exportService(): IExportService {
        return this._exportService;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
