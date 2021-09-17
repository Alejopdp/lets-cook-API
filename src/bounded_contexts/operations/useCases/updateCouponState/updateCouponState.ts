import { IStorageService } from "../../application/storageService/IStorageService";
import { Coupon } from "../../domain/cupons/Cupon";
import { CouponId } from "../../domain/cupons/CouponId";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { UpdateCuponStateDto } from "./updateCouponStateDto";
import { CouponState } from "../../domain/cupons/CouponState";

export class UpdateCoupon {
    private _couponRepository: ICouponRepository;
    private _storageService: IStorageService;

    constructor(couponRepository: ICouponRepository, storageService: IStorageService) {
        this._couponRepository = couponRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCuponStateDto): Promise<void> {
        const couponId: CouponId = new CouponId(dto.id);
        const coupon: Coupon | undefined = await this.couponRepository.findById(couponId);
        if (!coupon) throw new Error("El cupon ingresado no existe");

        coupon.updateState((<any>CouponState)[dto.state]);

        await this.couponRepository.save(coupon);
    }

    /**
     * Getter planRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
