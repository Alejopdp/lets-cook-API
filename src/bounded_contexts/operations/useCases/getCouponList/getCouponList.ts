import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Coupon } from "../../domain/cupons/Cupon";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { GetCouponListDto } from "./getCouponListDto";
import { GetCouponListPresenter } from "./getCouponListPresenter";

export class GetCouponList {
    private _couponRepository: ICouponRepository;
    private _storageService: IStorageService;

    constructor(couponRepository: ICouponRepository, storageService: IStorageService) {
        this._couponRepository = couponRepository;
        this._storageService = storageService;
    }

    public async execute(): Promise<any> {
        var coupons: Coupon[] = await this.couponRepository.findAll();
        return GetCouponListPresenter.present(coupons);
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
