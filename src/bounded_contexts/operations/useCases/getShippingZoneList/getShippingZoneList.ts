import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { GetShippingZoneListDto } from "./getShippingZoneListDto";
import { GetShippingListPresenter } from "./getShippingZoneListPresenter";

export class GetShippingZoneList {
    private _shippingRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingRepository = shippingRepository;
        this._storageService = storageService;
    }

    public async execute(): Promise<any> {
        var shippings: ShippingZone[] = await this.shippingRepository.findAll();
        return GetShippingListPresenter.present(shippings);
    }

    /**
     * Getter shippingRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingRepository(): IShippingZoneRepository {
        return this._shippingRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
