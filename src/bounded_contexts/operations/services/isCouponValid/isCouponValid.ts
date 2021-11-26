import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { IsCouponValidDto } from "./isCouponValidDto";

export class IsCouponValid {
    constructor() {}

    public async execute(dto: IsCouponValidDto): Promise<any> {
        const planPrice = dto.plan.getPlanVariantPrice(dto.planVariantId);
        if (
            !dto.coupon.isFreeShippingCoupon() &&
            (Math.round(planPrice * 100) - Math.round(dto.coupon.getDiscount(dto.plan, dto.planVariantId, dto.shippingCost) * 100)) / 100 <
                0
        )
            throw new Error("El cupón no es aplicable al importe del plan");

        if (!dto.coupon.hasStarted()) throw new Error("El cupón ingresado no es válido");
        if (dto.coupon.isExpiredByEndDate()) throw new Error("El cupón de descuento ingresado ha expirado");

        if (!dto.coupon.isValid(dto.customerSubscriptions, dto.plan, dto.planVariantId, dto.shippingCost))
            throw new Error("No puedes aplicar a este cupón");

        return dto.coupon;
    }
}
