import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { GetShippingZoneByIdDto } from "./getShippingZoneByIdDto";
import { GetShippingZoneByIdPresenter } from "./getShippingZoneByIdPresenter";

export class GetShippingZoneById {
    private _shippingZoneRepository: IShippingZoneRepository;

    constructor(shippingZoneRepository: IShippingZoneRepository) {
        this._shippingZoneRepository = shippingZoneRepository;
    }

    public async execute(dto: GetShippingZoneByIdDto): Promise<any> {
        const shippingZoneId: ShippingZoneId = new ShippingZoneId(dto.id);
        const shipping: ShippingZone | undefined = await this.shippingZoneRepository.findById(shippingZoneId);

        if (!shipping) throw new Error("Error al buscar el cupón");

        return GetShippingZoneByIdPresenter.present(shipping, dto.locale);
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Setter shippingZoneRepository
     * @param {ICouponRepository} value
     */
    public set shippingZoneRepository(value: IShippingZoneRepository) {
        this._shippingZoneRepository = value;
    }
}
