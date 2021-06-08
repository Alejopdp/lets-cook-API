import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Coupon } from "../../domain/cupons/Cupon";
import { PlanId } from "../../domain/plan/PlanId";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { CreateCouponDto } from "./createCouponDto";

export class CreateCoupon {
    private _couponRepository: ICouponRepository;
    private _storageService: IStorageService;

    constructor(couponRepository: ICouponRepository, storageService: IStorageService) {
        this._couponRepository = couponRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CreateCouponDto): Promise<void> {
        const type: ICouponType = 
        dto.discountType === "fixed" ? new FixedPrice(dto.discountType, dto.discountValue) : 
        dto.discountType === "free" ? new FreeShipping(dto.discountType, dto.discountValue) : 
        new PercentPrice(dto.discountType, dto.discountValue);
        const productsForApplying: PlanId[] = dto.productsForApplyingValue
        .map((id: string) => new PlanId(id));
        // const locale: Locale = (<any>Locale)[dto.locale] || Locale.es;
        // const additionalPlans: Plan[] =
        //     dto.additionalPlansIds.length > 0
        //         ? await this.planRepository.findAdditionalPlanListById(
        //               dto.additionalPlansIds.map((id: string | number) => new PlanId(id)),
        //               dto.locale
        //           )
        //         : [];

        // // for (let variant of dto.planVariants) {
        // //     var attributes: PlanVariantAttribute[] = [];

        // //     attributes = Object.entries(variant).map((entry) => new PlanVariantAttribute(entry[0], entry[1] as string));

        // //     if (dto.hasRecipes) {
        // //         attributes = attributes.filter(
        // //             (attr) =>
        // //                 attr.key.toLowerCase() !== "personas" &&
        // //                 attr.key.toLowerCase() !== "recetas" &&
        // //                 attr.key.toLowerCase() !== "id" &&
        // //                 attr.key.toLowerCase() !== "sku" &&
        // //                 attr.key.toLowerCase() !== "price" &&
        // //                 attr.key.toLowerCase() !== "pricewithoffer"
        // //         );

        // //         let variantWithRecipe: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        // //             variant.Personas,
        // //             variant.Recetas,
        // //             new PlanSku(variant.sku),
        // //             "",
        // //             variant.price,
        // //             variant.priceWithOffer,
        // //             attributes
        // //         );
        // //         planVariants.push(variantWithRecipe);
        // //     } else {
        // //         attributes = attributes.filter(
        // //             (attr) =>
        // //                 attr.key.toLowerCase() !== "id" &&
        // //                 attr.key.toLowerCase() !== "sku" &&
        // //                 attr.key.toLowerCase() !== "price" &&
        // //                 attr.key.toLowerCase() !== "pricewithoffer"
        // //         );

        // //         let planVariant: PlanVariant = new PlanVariant(
        // //             new PlanSku(variant.sku),
        // //             "",
        // //             variant.price,
        // //             attributes,
        // //             variant.priceWithOffer
        // //         );
        // //         planVariants.push(planVariant);
        // //     }
        // // }

        const coupon: Coupon = Coupon.create(
            dto.couponCode,
            type,
            dto.minRequireType,
            dto.minRequireValue,
            dto.productsForApplyingType,
            productsForApplying,
            dto.limites,
            dto.maxChargeQtyType,
            dto.maxChargeQtyValue,
            dto.startDate,
            dto.endDate,
            "active"
        );
        // console.log("CouponUseCase: ", coupon)
        await this.couponRepository.save(coupon);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
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
