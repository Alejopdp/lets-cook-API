import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { UpdateShippingZoneDto } from "./updateShippingZoneDto";
import { updatePaymentOrdersShippingCost } from "../../services/updatePaymentOrdersShippingCost";
import { Day } from "../../domain/day/Day";

export class UpdateShippingZone {
    private _shippingZoneRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingZoneRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingZoneRepository = shippingZoneRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateShippingZoneDto): Promise<void> {
        const shippingZoneId: ShippingZoneId = new ShippingZoneId(dto.id);
        const shipping: ShippingZone | undefined = await this.shippingZoneRepository.findById(shippingZoneId);
        if (!shipping) throw new Error("La zona de envío indicada no existe");
        const shippingCostHasChanged = shipping.cost !== dto.cost;
        var shippingDayOfWeek: Day = new Day(dto.day);

        var shippingRadio: ShippingZoneRadio | undefined = undefined;

        if (dto.radio.length > 0) {
            let coordinatesRadio = dto.radio.map((val: any, i: number) => {
                let aux = {
                    latitude: val[0],
                    longitude: val[1],
                };
                return aux;
            });

            shippingRadio = new ShippingZoneRadio(coordinatesRadio.map((value: any) => new Coordinates(value.latitude, value.longitude)));
        }

        shipping.name = dto.name;
        shipping.reference = dto.reference;
        shipping.cost = dto.cost;
        shipping.state = dto.state || shipping.state;
        if (!!shippingRadio) shipping.updateShippingRadio(shippingRadio);

        await this.shippingZoneRepository.save(shipping);
        if (shippingCostHasChanged) {
            await updatePaymentOrdersShippingCost.execute(shipping, dto.cost);
        }
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
