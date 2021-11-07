import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Address } from "../../domain/address/Address";
import { AddressId } from "../../domain/address/AddressId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerShippingDto } from "./updateCustomerShippingDto";
import { PreferredDeliveryTimeFactory } from "../../domain/customer/preferredDeliveryTime/preferredDeliveryTimeFactory";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";
import { IShippingZoneRepository } from "../../infra/repositories/shipping/IShippingZoneRepository";
import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { INotificationService } from "@src/shared/notificationService/INotificationService";

export class UpdateCustomerShipping {
    private _customerRepository: ICustomerRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _shippingZoneRepository: IShippingZoneRepository;
    private _storageService: IStorageService;
    private _notificationService: INotificationService;
    private _orderRepository: IOrderRepository;

    constructor(
        customerRepository: ICustomerRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        shippingZoneRepository: IShippingZoneRepository,
        storageService: IStorageService,
        notificationService: INotificationService,
        orderRepository: IOrderRepository
    ) {
        this._customerRepository = customerRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._shippingZoneRepository = shippingZoneRepository;
        this._storageService = storageService;
        this._notificationService = notificationService;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: UpdateCustomerShippingDto): Promise<void> {
        const shippingZones: ShippingZone[] = await this.shippingZoneRepository.findAll();
        const customerNewShippingZone: ShippingZone | undefined = shippingZones.find((zone) => zone.hasAddressInside(dto.lat, dto.long));
        if (!!!customerNewShippingZone)
            throw new Error("En este momento no podemos servir en tu zona, pero puedes dejarnos tu email y te avisaremos cuando toque!");

        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findByIdOrThrow(customerId);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findFutureOrdersByCustomer(customerId);
        const orders: Order[] = await this.orderRepository.findACtiveOrdersByPaymentOrderIdList(paymentOrders.map((po) => po.id));
        const preferredDeliveryTime = dto.deliveryTime ? PreferredDeliveryTimeFactory.createDeliveryTime(dto.deliveryTime) : undefined;

        customer.changeShippingAddress(dto.lat, dto.long, dto.name, dto.fullName, dto.details, preferredDeliveryTime);
        paymentOrders.forEach((order) =>
            order.state.isActive() && !order.hasFreeShipping ? (order.shippingCost = customerNewShippingZone.cost) : ""
        );
        orders.forEach((order) => order.moveShippingDateToDIfferentDayNumberOfSameWeek(customerNewShippingZone.getDayNumberOfWeek()));

        await this.paymentOrderRepository.updateMany(paymentOrders);
        await this.customerRepository.save(customer);
        await this.orderRepository.updateMany(orders);
        this.notificationService.notifyAdminAboutAddressChange(customer, dto.nameOrEmailOfAdminExecutingRequest);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter shippingZoneRepository
     * @return {IShippingZoneRepository}
     */
    public get shippingZoneRepository(): IShippingZoneRepository {
        return this._shippingZoneRepository;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }
}
