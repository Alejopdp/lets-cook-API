import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { PlanId } from "../../domain/plan/PlanId";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CustomerEmailValidationDto } from "./customerEmailValidationDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";

export class CustomerEmailValidation {
    private _customerEmailValidation: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(customerEmailValidationRepository: ICustomerRepository, storageService: IStorageService) {
        this._customerEmailValidation = customerEmailValidationRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CustomerEmailValidationDto): Promise<any> {
        const password: UserPassword = UserPassword.create('', false).hashPassword();
        const customer: Customer = Customer.create(dto.email, false, password, undefined, undefined);
        // console.log("CustomerUseCase: ", customer);
        let emailVerified: boolean = await this.customerEmailValidationRepository.isEmailVerified(customer.email);
        return emailVerified;
    }

    /**
     * Getter planRepository
     * @return {IShippingZoneRepository}
     */
    public get customerEmailValidationRepository(): ICustomerRepository {
        return this._customerEmailValidation;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
