import { CouponState } from "../../domain/cupons/CouponState";
import { Coupon } from "../../domain/cupons/Cupon";
import { CouponTypeFactory } from "../../domain/cupons/CuponType/CouponTypeFactory";
import { LimitApplicationFactory } from "../../domain/cupons/LimitAplication/LimitApplicationFactory";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CreateFriendCodeDto } from "./createFriendCodeDto";

// el cupón es ascendente y consecutivo, tiene esta forma "LETSCOOK069", "LETSCOOK070"... Ya vamos por el 1123. La idea es que cuando se cree un cliente con contraseña, se le asigne el consecutivo y se cree el cupón (o ya tener creados por excel todos los cupones)
// 10 EU de descuento, primera suscripción, no restringido a cantidad de veces, por única vez - primer cargo

export class CreateFriendCode {
    private _couponRepository: ICouponRepository;
    private _customerRepository: ICustomerRepository;

    constructor(couponRepository: ICouponRepository, customerRepository: ICustomerRepository) {
        this._couponRepository = couponRepository;
        this._customerRepository = customerRepository;
    }
    public async execute(dto: CreateFriendCodeDto): Promise<any> {
        const customer = dto.customer;
        if (customer.friendCode) return;
        const customersWithFriendCodeNumber = await this.customerRepository.countCustomersWithFriendCode();

        customer.createFriendCode(customersWithFriendCodeNumber + 301); // TO DO: Change logic, count coupons with same criteria

        const friendCodeCoupon: Coupon = Coupon.create(
            customer.friendCode!,
            CouponTypeFactory.create("fixed", 10),
            "none",
            0,
            "all",
            [],
            [LimitApplicationFactory.create("limit_one_customer", 0), LimitApplicationFactory.create("first_order", 0)],
            "only_fee",
            1,
            new Date(),
            CouponState.ACTIVE,
            0
        );

        await this.couponRepository.save(friendCodeCoupon);
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
