import { Coupon } from "../../domain/cupons/Cupon";
import { CouponId } from "../../domain/cupons/CouponId";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { GetCouponValidationDto } from "./getCouponValidationDto";
import { GetCouponByIdPresenter } from "./getCouponByIdPresenter";

export class GetCouponValidation {
    private _couponRepository: ICouponRepository;

    constructor(couponRepository: ICouponRepository) {
        this._couponRepository = couponRepository;
    }

    public async execute(dto: GetCouponValidationDto): Promise<any> {
        // const couponId: CouponId = new CouponId(dto.coupon);
        const coupon: Coupon | undefined = await this.couponRepository.findByCode(dto.coupon);
        console.log(coupon)

        if (!coupon) throw new Error("Error al buscar el cupón");

        let currentDate = new Date();
        if(currentDate > coupon.endDate) throw new Error("El cupón ha caducado");

        return "Cupón Válido";
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Setter couponRepository
     * @param {ICouponRepository} value
     */
    public set couponRepository(value: ICouponRepository) {
        this._couponRepository = value;
    }
}
