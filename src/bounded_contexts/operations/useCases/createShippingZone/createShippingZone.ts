import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { CreateShippingZoneDto } from "./createShippingZoneDto";
import { shippingRouter } from "../../infra/http/shipping";
import { Day } from "../../domain/day/Day";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";

export class CreateShippingZone {
    private _shippingRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingRepository = shippingRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CreateShippingZoneDto): Promise<void> {
        let coordinatesRadio: Coordinates[] = dto.radio.map((val: any, i: number) => new Coordinates(val[1], val[0]));
        const shippingZoneRadio: ShippingZoneRadio = new ShippingZoneRadio(coordinatesRadio);

        const shippingDay: Day = new Day(dto.shippingDayOfWeek);
        const shipping: ShippingZone = ShippingZone.create(dto.name, dto.reference, dto.cost, dto.state, shippingZoneRadio, shippingDay);

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
