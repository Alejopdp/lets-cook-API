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
import { updateOrdersShippingDateAfterUpdatingAShippingZoneDay } from "../../services/updateOrdersShippingDateAfterUpdatingAShippingZoneDay";

export class UpdateShippingZone {
    private _shippingZoneRepository: IShippingZoneRepository;
    private _storageService: IStorageService;

    constructor(shippingZoneRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingZoneRepository = shippingZoneRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateShippingZoneDto): Promise<void> {
        const shippingZoneId: ShippingZoneId = new ShippingZoneId(dto.id);
        const shippingZone: ShippingZone | undefined = await this.shippingZoneRepository.findById(shippingZoneId);
        if (!shippingZone) throw new Error("La zona de envío indicada no existe");

        const shippingCostHasChanged = shippingZone.cost !== dto.cost;
        const newShippingDayOfWeek: Day = new Day(dto.day);
        const oldShippingDayOfWeek: Day = new Day(shippingZone.getDayNumberOfWeek());
        const shippingDayOfWeekHasChanged = !newShippingDayOfWeek.equals(oldShippingDayOfWeek);

        console.log("Old day: ", oldShippingDayOfWeek.dayNumberOfWeek);
        console.log("NEw day: ", newShippingDayOfWeek.dayNumberOfWeek);

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

        shippingZone.name = dto.name;
        shippingZone.reference = dto.reference;
        shippingZone.cost = dto.cost;
        shippingZone.state = dto.state || shippingZone.state;
        if (!!shippingRadio) shippingZone.updateShippingRadio(shippingRadio);
        if (shippingDayOfWeekHasChanged) shippingZone.shippingDayOfWeek = newShippingDayOfWeek;

        await this.shippingZoneRepository.save(shippingZone);

        if (shippingCostHasChanged) {
            await updatePaymentOrdersShippingCost.execute(shippingZone, dto.cost);
        }

        if (shippingDayOfWeekHasChanged) {
            shippingZone.shippingDayOfWeek = oldShippingDayOfWeek;
            await updateOrdersShippingDateAfterUpdatingAShippingZoneDay.execute({
                shippingZone,
                newShippingDayOfWeek,
            });
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
