import { IStorageService } from "../../application/storageService/IStorageService";
import { Order } from "../../domain/order/Order";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { GetShippingRateDto } from "./getShippingRateDto";

export class GetShippingRate {
    private _shippingRepository: IShippingZoneRepository;
    private _orderRepository: IOrderRepository;

    constructor(shippingRepository: IShippingZoneRepository, orderRepository: IOrderRepository) {
        this._shippingRepository = shippingRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: GetShippingRateDto): Promise<{ shippingZone: ShippingZone; hasNextShipping: boolean }> {
        if (!dto.latitude || !dto.longitude) throw new Error("Es necesario ingresar tanto una latitud como una longitud");
        const shippings: ShippingZone[] = await this.shippingRepository.findAllActive();
        const coordinates: Coordinates = new Coordinates(dto.latitude, dto.longitude);
        const shippingZone: ShippingZone | undefined = shippings.find((zone) =>
            zone.hasAddressInside(coordinates.latitude, coordinates.longitude)
        );
        var nextCustomerOrder: Order | undefined = undefined;

        if (!!dto.currentUser) {
            const orders: Order[] = await this.orderRepository.findByShippingDates([shippingZone?.nextShippingDate()!], dto.locale);
            nextCustomerOrder = orders.find(
                (order) => order.customer.id.equals(dto.currentUser?.id) && (order.isActive() || order.isBilled())
            );
        }

        if (!!!shippingZone) throw new Error("La dirección ingresada no está dentro de ninguna de nuestras zonas de envío");

        return { shippingZone, hasNextShipping: !!nextCustomerOrder };
    }

    /**
     * Getter shippingRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingRepository(): IShippingZoneRepository {
        return this._shippingRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
