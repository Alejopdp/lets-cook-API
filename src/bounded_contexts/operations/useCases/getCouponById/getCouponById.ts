import { Coupon } from "../../domain/cupons/Cupon";
import { CouponId } from "../../domain/cupons/CouponId";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { GetCouponByIdDto } from "./getCouponByIdDto";
import { GetCouponByIdPresenter } from "./getCouponByIdPresenter";

export class GetCouponById {
    private _couponRepository: ICouponRepository;

    constructor(couponRepository: ICouponRepository) {
        this._couponRepository = couponRepository;
    }

    public async execute(dto: GetCouponByIdDto): Promise<any> {
        const couponId: CouponId = new CouponId(dto.couponId);
        const coupon: Coupon | undefined = await this.couponRepository.findById(couponId);

        if (!coupon) throw new Error("Error al buscar el cupón");

        return GetCouponByIdPresenter.present(coupon);
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
