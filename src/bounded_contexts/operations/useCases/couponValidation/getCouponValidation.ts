import { Coupon } from "../../domain/cupons/Cupon";
import { CouponId } from "../../domain/cupons/CouponId";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { GetCouponValidationDto } from "./getCouponValidationDto";
import { GetCouponByIdPresenter } from "./getCouponByIdPresenter";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Subscription } from "../../domain/subscription/Subscription";

// [] Se ingresa un código de envío gratis cuando aún no se calculó el costo del mismo
// [] Se ingresa un código de envío gratis cuando el envío ya es gratis
// [] Se ingresa un cupón que tiene límite de uso 1 por cliente y ya se utilizó
// [] Se ingresa un cupón para primeros clientes pero el cliente ya tuvo/tiene alguna suscripción
// [] Se ingresa un código que expiró
// [] El cupón de descuento ingresado ha expirado
// [] Se ingresa un código con monto mínimo, y el monto de la orden es menor
// [] Se ingresa un código para un plan en particular, y el plan por comprar es distinto
export class GetCouponValidation {
    private _couponRepository: ICouponRepository;
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(couponRepository: ICouponRepository, subscriptionRepository: ISubscriptionRepository) {
        this._couponRepository = couponRepository;
        this._subscriptionRepository = subscriptionRepository;
    }

    public async execute(dto: GetCouponValidationDto): Promise<any> {
        const coupon: Coupon | undefined = await this.couponRepository.findByCode(dto.coupon);
        const customerId: CustomerId = new CustomerId(dto.customerId);

        if (!coupon) throw new Error("El cupón de descuento ingresado es incorrecto");

        let currentDate = new Date();
        if (currentDate > coupon.endDate) throw new Error("El cupón de descuento ingresado ha expirado");

        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId);

        if (!coupon.isValid(customerSubscriptions)) throw new Error("No puedes aplicar a este cupón");

        return coupon;
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
