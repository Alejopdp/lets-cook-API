import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { Either, Failure, isFailure, isSuccess } from "../../../../core/logic/Result";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { CodeValidationDto } from "./codeValidationDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";

export class CodeValidation {
    private _codeValidation: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(codeValidationRepository: ICustomerRepository, storageService: IStorageService) {
        this._codeValidation = codeValidationRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CodeValidationDto): Promise<any> {

        const customer: Customer | undefined = await this.codeValidationRepository.findByEmail(dto.email);

        if (!customer) throw new Error("Email incorrecto");
        if (customer?.codeToRecoverPassword !== dto.code) throw new Error("Código incorrecto");

        return true;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get codeValidationRepository(): ICustomerRepository {
        return this._codeValidation;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
