import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { DeleteShippingZoneDto } from "./deleteShippingZoneDto";

export class DeleteShippingZone {
    private _shippingZoneRepository: IShippingZoneRepository;

    constructor(shippingZoneRepository: IShippingZoneRepository) {
        this._shippingZoneRepository = shippingZoneRepository;
    }

    public async execute(dto: DeleteShippingZoneDto): Promise<void> {
        const shippingZoneId: ShippingZoneId = new ShippingZoneId(dto.shippingId);
        await this.shippingZoneRepository.delete(shippingZoneId);
    }

    /**
     * Getter shippingRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }
}
