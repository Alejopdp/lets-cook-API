import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { GetCouponListPresenter } from "./getCustomerByNamePresenter";
import { GetCustomerByNameDto } from "./getCustomerByNameDto";

export class GetCustomerByName {
    private _couponRepository: ICustomerRepository;
    private _storageService: IStorageService;

    constructor(couponRepository: ICustomerRepository, storageService: IStorageService) {
        this._couponRepository = couponRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetCustomerByNameDto): Promise<any> {
        var customer: Customer[] = await this.customerRepository.findByName(dto.name);
        return GetCouponListPresenter.present(customer);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
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
