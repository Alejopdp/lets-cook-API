import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { UpdateOrdersShippingDateAfterUpdatingAShippingZoneDayDto } from "./updateOrdersShippingDateAfterUpdatingAShippingZoneDayDto";

export class UpdateOrdersShippingDateAfterUpdatingAShippingZoneDay {
    private _orderRepository: IOrderRepository;

    constructor(orderRepository: IOrderRepository) {
        this._orderRepository = orderRepository;
    }

    public async execute(dto: UpdateOrdersShippingDateAfterUpdatingAShippingZoneDayDto): Promise<any> {
        // const futureOrdersWithActualDayOfWeek: Order[] = await this.orderRepository.findFutureOrdersByShippingDayOfWeek(
        //     dto.shippingZone.shippingDayOfWeek
        // );
        const futureOrdersWithActualDayOfWeek: Order[] = await this.orderRepository.findFutureOrders(Locale.es);
        for (let order of futureOrdersWithActualDayOfWeek) {
            if (order.isGoingToBeShippedThisWeek(dto.queryDate)) continue;
            if (order.shippingDate.getDay() === dto.newShippingDayOfWeek.dayNumberOfWeek) continue;
            if (!dto.shippingZone.hasAddressInside(order.customer?.shippingAddress?.latitude!, order.customer?.shippingAddress?.longitude!))
                continue;

            order.moveShippingDateToDIfferentDayNumberOfSameWeek(dto.newShippingDayOfWeek.dayNumberOfWeek);
        }

        await this.orderRepository.updateMany(futureOrdersWithActualDayOfWeek);
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
