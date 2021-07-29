import { IStorageService } from "../../application/storageService/IStorageService";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { GetShippingRateDto } from "./getShippingRateDto";

export class GetShippingRate {
    private _shippingRepository: IShippingZoneRepository;

    constructor(shippingRepository: IShippingZoneRepository, storageService: IStorageService) {
        this._shippingRepository = shippingRepository;
    }

    public async execute(dto: GetShippingRateDto): Promise<ShippingZone> {
        if (!dto.latitude || !dto.longitude) throw new Error("Es necesario ingresar tanto una latitud como una longitud");
        const shippings: ShippingZone[] = await this.shippingRepository.findAll();
        const coordinates: Coordinates = new Coordinates(dto.latitude, dto.longitude);

        const shippingZone: ShippingZone | undefined = shippings.find((zone) =>
            zone.hasAddressInside(coordinates.latitude, coordinates.longitude)
        );

        if (!!!shippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        return shippingZone;
    }

    /**
     * Getter shippingRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingRepository(): IShippingZoneRepository {
        return this._shippingRepository;
    }
}
