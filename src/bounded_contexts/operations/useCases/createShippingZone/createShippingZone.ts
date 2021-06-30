import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { PlanId } from "../../domain/plan/PlanId";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { CreateShippingZoneDto } from "./createShippingZoneDto";
import { shippingRouter } from "../../infra/http/shipping";
import { Day } from "../../domain/day/Day";

export class CreateShippingZone {
    private _shippingRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingRepository = shippingRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CreateShippingZoneDto): Promise<void> {
        let coordinatesRadio = dto.radio.map((val: any, i: number) => {
            let aux = {
                latitude: val[0],
                longitude: val[1],
            };
            return aux;
        });
        const coordinates: ShippingZoneRadio = coordinatesRadio.map((value: any) => new Coordinates(value.latitude, value.longitude));

        const shippingDay: Day = new Day(dto.shippingDayOfWeek);
        const shipping: ShippingZone = ShippingZone.create(dto.name, dto.reference, dto.cost, dto.state, coordinates, shippingDay);

        await this.shippingRepository.save(shipping);
    }

    /**
     * Getter planRepository
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
