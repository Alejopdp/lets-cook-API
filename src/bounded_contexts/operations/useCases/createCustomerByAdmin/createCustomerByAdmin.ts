import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";
import { Billing } from "../../domain/billing/Billing";
import { Address } from "../../domain/address/Address";
import { PersonalInfo } from "../../domain/customer/personalInfo/PersonalInfo";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { createCustomerDto } from "./createCustomerByAdminDto";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { PreferredDeliveryTimeFactory } from "../../domain/customer/preferredDeliveryTime/preferredDeliveryTimeFactory";

export class CreateCustomerByAdmin {
    private _signUpRepository: ICustomerRepository;
    private _storageService: IStorageService;
    // private _paymentService: IPaymentService;

    constructor(signUpRepository: ICustomerRepository, storageService: IStorageService) {
        this._signUpRepository = signUpRepository;
        this._storageService = storageService;
        // this._paymentService = paymentService;
    }

    public async execute(dto: createCustomerDto): Promise<any> {
        const customerInfo: Customer | undefined = await this.signUpRepository.findByEmail(dto.email);
        if (customerInfo) throw new Error("El usuario ya existe, por favor utiliza otro correo");

        const preferedDeliveryTime = PreferredDeliveryTimeFactory.createDeliveryTime(dto.addressPreferredSchedule);
        const address: Address = new Address(
            dto.latShipping,
            dto.longShipping,
            dto.address,
            dto.address,
            dto.addressDetails,
            preferedDeliveryTime
        );
        const billing: Billing = new Billing(
            dto.latBilling,
            dto.longBilling,
            dto.billingAddressName,
            dto.customerName,
            dto.billingDetails,
            dto.identification
        );
        const personalInfo: PersonalInfo = new PersonalInfo(
            dto.name,
            dto.lastName,
            dto.phone1,
            dto.phone2,
            new Date(dto.birthDate),
            dto.preferredLanguage
        );
        // const password: UserPassword = UserPassword.create(dto.password, false).hashPassword();
        const customer: Customer = Customer.create(
            dto.email,
            false,
            "test",
            [],
            0,
            new Date(),
            address,
            billing,
            undefined,
            dto.state,
            undefined,
            personalInfo
        );

        await this.signUpRepository.save(customer);

        return customer;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get signUpRepository(): ICustomerRepository {
        return this._signUpRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
