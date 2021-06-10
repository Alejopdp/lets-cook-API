import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { UpdateShippingZoneStateDto } from "./updateCouponStateDto";

export class UpdateShippingZone {
    private _shippingZoneRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingZoneRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingZoneRepository = shippingZoneRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateShippingZoneStateDto): Promise<void> {
        const shippingZoneId: ShippingZoneId = new ShippingZoneId(dto.id);
        const shipping: ShippingZone | undefined = await this.shippingZoneRepository.findById(shippingZoneId);
        if (!shipping) throw new Error("El cupon ingresado no existe");

        shipping.updateState(dto.state)

        // console.log("UseCase: ",coupon)

        await this.shippingZoneRepository.updateState(shipping);
    }

    /**
     * Getter shippingRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
