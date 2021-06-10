import { updateShippingZone } from './index';
import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { PlanId } from "../../domain/plan/PlanId";
import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { PlanSku } from "../../domain/plan/PlanSku";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { UpdateShippingZoneStateDto } from "./updateShippingZoneStateDto";

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
        let coordinatesRadio = dto.radio.map((val: any, i: number) => {
            let aux = {
                "latitude": val[0],
                "longitude": val[1]
            }
            return aux
        });
        const coordinates: ShippingZoneRadio = coordinatesRadio
        .map((value: any) => new Coordinates(value.latitude, value.longitude));

        shipping.name = dto.name;
        shipping.reference = dto.reference;
        shipping.cost = dto.cost;
        shipping.state = dto.state;
        shipping.updateShippingRadio(coordinates);

        console.log("UseCase: ",shipping)

        await this.shippingZoneRepository.save(shipping);
    }

    /**
     * Getter shippingZoneRepository
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
